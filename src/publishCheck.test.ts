import {ParseResults} from "./types";

const listForRef = jest.fn();
const create = jest.fn().mockReturnValue({data: {html_url: "aUrl"}});
const update = jest.fn().mockReturnValue({data: {html_url: "aUrl"}});
const getOctokit = jest.fn().mockReturnValue({
    rest: {
        checks: {
            listForRef,
            create,
            update
        }
    }
});
const coreInfo = jest.fn();

jest.mock("./config", () => ({
    githubToken: "aToken",
    checkName: "aCheckName",
}));

jest.mock("@actions/github", () => ({
    context: {
        repo: {owner: "anOwner", repo: "aRepo"},
        sha: "aCommit"
    },
    getOctokit
}));

jest.mock("@actions/core", () => ({
    info: coreInfo
}));

import {publishCheck} from "./publishCheck";

describe("publishCheck", () => {

    test.each([[false], [true]])("publishes check [checkExists=%p]", async (checkExists) => {
        listForRef.mockReturnValue({data: {check_runs: checkExists ? [{id: 123}] : []}});

        await publishCheck(new ParseResults({
            tests: {
                suites: [
                    {
                        name: "suite1", tests: 5, passed: 2, errors: 0, skipped: 1, failed: 1, cases: [
                            {name: "case1", time: 0.1},
                            {name: "case2", time: 0.2},
                            {name: "case3", time: 0.3, skipped: true},
                            {name: "case4", time: 0.4, failure: "a Failure"}
                        ]
                    },
                    {
                        name: "suite2", tests: 2, passed: 2, errors: 0, skipped: 0, failed: 0, cases: [
                            {name: "case1", time: 0.1},
                            {name: "case2", time: 0.2},
                        ]
                    }
                ], totals: {count: 4, passed: 2, errors: 0, skipped: 1, failed: 1}
            },
            checks: {
                checks: [
                    {name: "check1", errors: 3, warnings: 1, others: 2},
                    {name: "check2", errors: 7, warnings: 3, others: 4},
                ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
            },
            totals: {errors: 10, warnings: 4, others: 6},
            annotations: [{
                file: "file1",
                startLine: 1,
                endLine: 2,
                type: "error",
                message: "message1",
                title: "title1",
                rawDetails: "rawDetails1"
            }]
        }));

        expect(getOctokit).toHaveBeenCalledWith("aToken");
        expect(listForRef).toHaveBeenCalledWith({
            owner: "anOwner",
            repo: "aRepo",
            ref: "aCommit",
            check_name: "aCheckName",
            status: "in_progress",
            filter: "latest"
        });

        const params = {
            owner: "anOwner",
            repo: "aRepo",
            name: "aCheckName",
            head_sha: "aCommit",
            status: "completed",
            conclusion: "failure",
            output: {
                title: "4 tests, 2 passed, 1 skipped, 1 failed, checks: 3 errors, 2 warnings, 1 other",
                summary: "",
                annotations: [{
                    path: "file1",
                    start_line: 1,
                    end_line: 2,
                    annotation_level: "failure",
                    message: "message1",
                    title: "title1",
                    raw_details: "rawDetails1"
                }]
            }
        };
        if (checkExists) {
            expect(create).not.toHaveBeenCalled();
            expect(update).toHaveBeenCalledWith({...params, check_run_id: 123});
        } else {
            expect(create).toHaveBeenCalledWith(params);
            expect(update).not.toHaveBeenCalled();
        }
    });

});