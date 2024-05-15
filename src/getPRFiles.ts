import * as github from '@actions/github';
import { type components } from '@octokit/openapi-types';
import {githubToken} from "./config";

export type FileStatus = components['schemas']['diff-entry']['status'];

export async function getPRFiles(...statuses: FileStatus[]) {
  const issue = github.context.issue;
  if (!issue.number) {
    return;
  }

  const octokit = github.getOctokit(githubToken);
  return octokit
    .paginate(octokit.rest.pulls.listFiles, {
      owner: issue.owner,
      repo: issue.repo,
      pull_number: issue.number,
      per_page: 100,
    })
    .then((files) =>
      files
        .filter(
          (file) => statuses.length == 0 || statuses.includes(file.status),
        )
        .map((file) => file.filename),
    );
}
