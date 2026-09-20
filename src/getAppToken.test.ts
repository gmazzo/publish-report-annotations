import { vi, describe, test, expect } from "vitest";

const request = vi.fn().mockReturnValue({ data: { id: "anInstallationId" } });
const auth = vi.fn().mockReturnValue({ token: "anInstallationToken" });
const getInstallationOctokit = vi.fn().mockReturnValue({ auth });
const App = vi.fn(function AppMock() {
    return {
        octokit: { request },
        getInstallationOctokit,
    };
});
const setSecret = vi.fn();

vi.doMock("@octokit/app", () => ({
    App,
}));

vi.doMock("@actions/github", () => ({
    context: {
        repo: {
            owner: "anOwner",
            repo: "aRepo",
        },
    },
}));

vi.doMock("@actions/core", () => ({
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
