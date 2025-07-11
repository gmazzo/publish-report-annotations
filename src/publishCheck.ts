import * as github from "@actions/github";
import * as core from "@actions/core";
import { Config, ParseResults } from "./types";
import { shouldFail } from "./utils";
import { summaryOf, summaryTableOf } from "./summary";
import { RequestError } from "@octokit/request-error";

export async function publishCheck(results: ParseResults, config: Config) {
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
                    message: annotation.message || "No message provided",
                    title: annotation.title,
                    raw_details: annotation.rawDetails,
                },
            ];
        }
        return [];
    });

    const params = {
        ...github.context.repo,
        name: config.checkName,
        head_sha: commit,
        status: "completed" as const,
        conclusion: shouldFail(results, config) ? "failure" : ("success" as "failure" | "success"),
        output: {
            title: summaryOf(results, true),
            summary: summaryTableOf(results, config),
            annotations: sanitizedAnnotations.slice(0, 50), // GitHub limit is 50 annotations per check run
        },
    };

    const { data: checks } = await onErrorRetry(() =>
        octokit.rest.checks.listForRef({
            ...github.context.repo,
            ref: commit,
            check_name: config.checkName,
            status: "in_progress",
            filter: "latest",
        }),
    );

    const checkRunId: number | null = checks.check_runs[0]?.id;

    const { html_url } = await onErrorRetry(() =>
        (checkRunId
            ? octokit.rest.checks.update({ ...params, check_run_id: checkRunId })
            : octokit.rest.checks.create(params)
        ).then((it) => it.data),
    );

    if (sanitizedAnnotations.length != params.output.annotations.length) {
        core.warning(
            `Due GitHub limitation, only ${params.output.annotations.length} of ${results.annotations.length} were reported.\nhttps://github.com/orgs/community/discussions/26680`,
        );
    }

    return html_url;
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
