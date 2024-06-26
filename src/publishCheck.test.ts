import {Config, ParseResults} from "./types";

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
const summaryOf = jest.fn().mockReturnValue("aSummary");
const summaryTableOf = jest.fn().mockReturnValue("aSummaryTable");

const config = {
    githubToken: "aToken",
    checkName: "aCheckName",
} as Config;

jest.mock("./summary", () => ({
    summaryOf,
    summaryTableOf
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
                        name: "suite1", passed: 3, skipped: 1, failed: 1, cases: [
                            {name: 'test1', className: 'class1', outcome: 'passed'},
                            {name: 'test2', className: 'class2', outcome: 'passed'},
                            {name: 'test3', className: 'class3', outcome: 'passed'},
                            {name: 'test4', className: 'class4', outcome: 'failed'},
                            {name: 'test5', className: 'class5', outcome: 'skipped'},
                        ]
                    },
                    {
                        name: "suite2", passed: 2, skipped: 0, failed: 0, cases: [
                            {name: 'test1', className: 'class1', outcome: 'passed'},
                            {name: 'test2', className: 'class2', outcome: 'passed'},
                        ]
                    }
                ], totals: {count: 4, passed: 2, skipped: 1, failed: 1}
            },
            checks: {
                checks: [
                    {
                        name: "check1",
                        errors: 3,
                        warnings: 1,
                        others: 2,
                        issues: {'check1': {severity: 'warning', count: 1}}
                    },
                    {
                        name: "check2",
                        errors: 7,
                        warnings: 3,
                        others: 4,
                        issues: {'check2': {severity: 'warning', count: 3}}
                    },
                ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
            },
            totals: {errors: 10, warnings: 4, others: 6},
            annotations: [{
                file: "file1",
                startLine: 1,
                endLine: 2,
                severity: "error",
                message: "message1",
                title: "title1",
                rawDetails: "rawDetails1"
            }]
        }), config);

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
                title: "aSummary",
                summary: "aSummaryTable",
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
