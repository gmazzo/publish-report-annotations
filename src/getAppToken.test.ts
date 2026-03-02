import { jest, describe, test, expect } from "@jest/globals";

const request = jest.fn().mockReturnValue({ data: { id: "anInstallationId" } });
const auth = jest.fn().mockReturnValue({ token: "anInstallationToken" });
const getInstallationOctokit = jest.fn().mockReturnValue({ auth });
const App = jest.fn().mockImplementation(() => ({
    octokit: { request },
    getInstallationOctokit,
}));
const setSecret = jest.fn();

jest.unstable_mockModule("@octokit/app", () => ({
    App,
}));

jest.unstable_mockModule("@actions/github", () => ({
    context: {
        repo: {
            owner: "anOwner",
            repo: "aRepo",
        },
    },
}));

jest.unstable_mockModule("@actions/core", () => ({
    setSecret,
}));

const { getAppToken } = await import("./getAppToken");

describe("getAppToken", () => {
    test("given an github app, should retrieve an installation token", async () => {
        const token = await getAppToken("anAppId", "anAppSecret");

        expect(App).toHaveBeenCalledWith({ appId: "anAppId", privateKey: "anAppSecret" });
        expect(request).toHaveBeenCalledWith("GET /repos/{owner}/{repo}/installation", {
            owner: "anOwner",
            repo: "aRepo",
        });
        expect(getInstallationOctokit).toHaveBeenCalledWith("anInstallationId");
        expect(auth).toHaveBeenCalledWith({ type: "installation" });
        expect(token).toEqual("anInstallationToken");
        expect(setSecret).toHaveBeenCalledWith("anInstallationToken");
    });
});
