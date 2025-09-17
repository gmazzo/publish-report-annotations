import * as github from "@actions/github";
import * as core from "@actions/core";
import { Config, ParseResults } from "./types";
import { shouldFail } from "./utils";
import { summaryOf, summaryTableOf } from "./summary";
import { RequestError } from "@octokit/request-error";

export const MAX_ANNOTATIONS_PER_API_CALL = 50;

export async function publishCheck(results: ParseResults, config: Config, partial: boolean, checkRunId?: number) {
    const octokit = github.getOctokit(config.githubToken);

    const commit = (github.context.payload?.pull_request?.head?.sha || github.context.sha) as string;

    const sanitizedAnnotations = results.annotations.flatMap((annotation) => {
        if (annotation.file) {
            return [
                {
                    path: annotation.file,
                    start_line: annotation.startLine || 1,
                    end_line: annotation.endLine || 1,
                    annotation_level: getAnnotationType(annotation.severity),
                    message: annotation.message.truncate(65536) || "No message provided",
                    title: annotation.title?.truncate(255),
                    raw_details: annotation.rawDetails?.truncate(65536),
                },
            ];
        }
        return [];
    });

    const params = {
        ...github.context.repo,
        name: config.checkName,
        head_sha: commit,
        status: partial ? ("in_progress" as const) : ("completed" as const),
        conclusion: partial
            ? undefined
            : shouldFail(results, config)
              ? "failure"
              : ("success" as "failure" | "success"),
        output: {
            title: summaryOf(results, true),
            summary: summaryTableOf(results, config).truncate(65535),
            annotations: sanitizedAnnotations.slice(0, MAX_ANNOTATIONS_PER_API_CALL),
        },
    };

    if (!checkRunId) {
        const { data: checks } = await onErrorRetry(() =>
            octokit.rest.checks.listForRef({
                ...github.context.repo,
                ref: commit,
                check_name: config.checkName,
                status: "in_progress",
                filter: "latest",
            }),
        );

        checkRunId = checks.check_runs[0]?.id;
    }

    const result = await onErrorRetry(() =>
        (checkRunId
            ? octokit.rest.checks.update({ ...params, check_run_id: checkRunId })
            : octokit.rest.checks.create(params)
        ).then((it) => it.data),
    );

    for (let i = MAX_ANNOTATIONS_PER_API_CALL; i < sanitizedAnnotations.length; i += MAX_ANNOTATIONS_PER_API_CALL) {
        await onErrorRetry(() =>
            octokit.rest.checks.update({
                ...github.context.repo,
                check_run_id: result.id,
                output: {
                    ...params.output,
                    annotations: sanitizedAnnotations.slice(i, i + MAX_ANNOTATIONS_PER_API_CALL),
                },
            }),
        );
    }
    return result;
}

function getAnnotationType(value: ParseResults["annotations"][0]["severity"]): "failure" | "warning" | "notice" {
    switch (value) {
        case "error":
            return "failure";
        case "warning":
            return "warning";
        case "other":
            return "notice";
    }
}

async function onErrorRetry<Type>(request: () => Promise<Type>) {
    return request().catch(async (ex: RequestError) => {
        let delaySeconds;

        switch (ex.status) {
            case 504:
                delaySeconds = 30;
                break;

            case 403:
            case 429:
                const retryAfter = ex.response?.headers["retry-after"];
                if (retryAfter) {
                    delaySeconds = Number(retryAfter);
                    break;
                }
        }

        if (!delaySeconds) {
            throw ex;
        }

        core.warning(`Request failed with status ${ex.status}: ${ex.message}`);
        core.info(`Retrying in ${delaySeconds} seconds...`);
        await new Promise((it) => setTimeout(it, delaySeconds * 1000));
        return request();
    });
}
