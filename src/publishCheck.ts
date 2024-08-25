import * as github from "@actions/github";
import * as core from "@actions/core";
import {Config, ParseResults} from "./types";
import {shouldFail} from "./utils";
import {summaryOf, summaryTableOf} from "./summary";

export async function publishCheck(results: ParseResults, config: Config) {
    const octokit = github.getOctokit(config.githubToken);

    const commit = (github.context.payload?.pull_request?.head?.sha || github.context.sha) as string;

    const params= {
        ...github.context.repo,
        name: config.checkName,
        head_sha: commit,
        status: 'completed' as const,
        conclusion: shouldFail(results, config) ? "failure" : "success" as "failure" | "success",
        output: {
            title: summaryOf(results, true),
            summary: summaryTableOf(results, config),
            annotations: results.annotations.slice(0, 50).map(annotation => ({
                path: annotation.file || '',
                start_line: annotation.startLine || 0,
                end_line: annotation.endLine || 0,
                annotation_level: getAnnotationType(annotation.severity),
                message: annotation.message || '',
                title: annotation.title || '',
                raw_details: annotation.rawDetails
            }))
        }
    };

    const {data: checks} = await octokit.rest.checks.listForRef({
        ...github.context.repo,
        ref: commit,
        check_name: config.checkName,
        status: 'in_progress',
        filter: 'latest'
    });

    const checkRunId: number | null = checks.check_runs[0]?.id;

    const {data: {html_url}} = await (checkRunId ?
        octokit.rest.checks.update({ ...params, check_run_id: checkRunId }) :
        octokit.rest.checks.create(params));

    if (results.annotations.length != params.output.annotations.length) {
        core.warning(`Due GitHub limitation, only ${params.output.annotations.length} of ${results.annotations.length} were reported.\nhttps://github.com/orgs/community/discussions/26680`);
    }

    return html_url;
}

function getAnnotationType(value: ParseResults['annotations'][0]['severity']): 'failure' | 'warning' | 'notice' {
    switch (value) {
        case 'error':
            return 'failure';
        case 'warning':
            return 'warning';
        case 'other':
            return 'notice';
    }
}
