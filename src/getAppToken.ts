import * as core from "@actions/core";
import * as github from "@actions/github";
import { App } from "@octokit/app";

export async function getAppToken(appId: string, appSecret: string) {
    const app = new App({ appId, privateKey: appSecret });
    const { data: installation } = await app.octokit.request(
        `GET /repos/{owner}/{repo}/installation`,
        github.context.repo,
    );
    const octokit = await app.getInstallationOctokit(installation.id);
    const { token } = (await octokit.auth({ type: "installation" })) as { token: string };
    core.setSecret(token);
    return token;
}
