import * as github from "@actions/github";
import * as core from "@actions/core";
import {checkName, githubToken, warningsAsErrors} from "./config";
import {ParseResults} from "./types";
import {shouldFail} from "./utils";
import {summaryOf, summaryTableOf} from "./summary";

export async function publishCheck(results: ParseResults) {
    const octokit = github.getOctokit(githubToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const commit = (github.context.payload?.pull_request?.head?.sha || github.context.sha) as string;

    const params= {
        ...github.context.repo,
        name: checkName,
        head_sha: commit,
        status: 'completed' as const,
        conclusion: getConclusion(results),
        output: {
            title: summaryOf(results),
            summary: summaryTableOf(results),
            annotations: results.annotations.slice(0, 50).map(annotation => ({
                path: annotation.file || '',
                start_line: annotation.startLine || 0,
                end_line: annotation.endLine || 0,
                annotation_level: getAnnotationType(annotation.type),
                message: annotation.message || '',
                title: annotation.title || '',
                raw_details: annotation.rawDetails
            }))
        }
    };

    const {data: checks} = await octokit.rest.checks.listForRef({
        ...github.context.repo,
        ref: commit,
        check_name: checkName,
        status: 'in_progress',
        filter: 'latest'
    });

    const checkRunId: number | null = checks.check_runs[0]?.id;

    const {data: {html_url}} = await (checkRunId ?
        octokit.rest.checks.update({ ...params, check_run_id: checkRunId }) :
        octokit.rest.checks.create(params));

    core.info(`Check \`${checkName}\` reported at ${html_url}`);

    if (results.annotations.length != params.output.annotations.length) {
        core.warning(`Due GitHub limitation, only ${params.output.annotations.length} of ${results.annotations.length} were reported.\nhttps://github.com/orgs/community/discussions/26680`);
    }
}

function getConclusion(results: ParseResults): 'success' | 'failure' {
    return shouldFail(results.totals, warningsAsErrors) ? "failure" : "success";
}

function getAnnotationType(value: ParseResults['annotations'][0]['type']): 'failure' | 'warning' | 'notice' {
    switch (value) {
        case 'error':
            return 'failure';
        case 'warning':
            return 'warning';
        case 'other':
            return 'notice';
    }
}
