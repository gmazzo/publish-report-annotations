import * as github from "@actions/github";
import * as core from "@actions/core";
import {checkName, githubToken, warningsAsErrors} from "./config";
import ParsedAnnotations from "./ParsedAnnotations";
import {shouldFail, summaryOf} from "./utils";

export async function publishCheck(annotations: ParsedAnnotations) {
    const octokit = github.getOctokit(githubToken);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const commit = (github.context.payload?.pull_request?.head?.sha || github.context.sha) as string;

    const params= {
        ...github.context.repo,
        name: checkName,
        head_sha: commit,
        status: 'completed' as const,
        conclusion: getConclusion(annotations),
        output: {
            title: summaryOf(annotations),
            summary: "",
            annotations: annotations.annotations.slice(0, 50).map(annotation => ({
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

    core.notice(`Check \`${checkName}\` reported at ${html_url}`);

    if (annotations.annotations.length != params.output.annotations.length) {
        core.warning(`Due GitHub limitation, only ${params.output.annotations.length} of ${annotations.annotations.length} were reported.\nhttps://github.com/orgs/community/discussions/26680`);
    }
}

function getConclusion(value: ParsedAnnotations): 'success' | 'failure' {
    return shouldFail(value, warningsAsErrors) ? "failure" : "success";
}

function getAnnotationType(value: ParsedAnnotations['annotations'][0]['type']): 'notice' | 'warning' | 'failure' {
    switch (value) {
        case 'error':
            return 'failure';
        default:
            return value;
    }
}
