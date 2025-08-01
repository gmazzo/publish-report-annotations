import { Config, ParseResults } from "./types";

const listForRef = jest.fn();
const create = jest.fn().mockResolvedValue({ data: { id: 456, html_url: "aUrl" } });
const update = jest.fn().mockResolvedValue({ data: { html_url: "aUrl" } });
const getOctokit = jest.fn().mockReturnValue({
    rest: {
        checks: {
            listForRef,
            create,
            update,
        },
    },
});
const coreInfo = jest.fn();
const coreWarning = jest.fn();
const summaryOf = jest.fn().mockReturnValue("aSummary");
const summaryTableOf = jest.fn().mockReturnValue("aSummaryTable");

const config = {
    githubToken: "aToken",
    checkName: "aCheckName",
} as Config;

jest.mock("./summary", () => ({
    summaryOf,
    summaryTableOf,
}));

jest.mock("@actions/github", () => ({
    context: {
        repo: { owner: "anOwner", repo: "aRepo" },
        sha: "aCommit",
    },
    getOctokit,
}));

jest.mock("@actions/core", () => ({
    info: coreInfo,
    warning: coreWarning,
}));

jest.mock("@octokit/request-error", () => ({
    RequestError: RequestErrorMock,
}));

const sampleResults = new ParseResults({
    tests: {
        suites: [
            {
                name: "suite1",
                passed: 3,
                skipped: 1,
                failed: 1,
                cases: [
                    { name: "test1", className: "class1", outcome: "passed" },
                    { name: "test2", className: "class2", outcome: "passed" },
                    { name: "test3", className: "class3", outcome: "passed" },
                    { name: "test4", className: "class4", outcome: "failed" },
                    { name: "test5", className: "class5", outcome: "skipped" },
                ],
            },
            {
                name: "suite2",
                passed: 2,
                skipped: 0,
                failed: 0,
                cases: [
                    { name: "test1", className: "class1", outcome: "passed" },
                    { name: "test2", className: "class2", outcome: "passed" },
                ],
            },
        ],
        totals: { count: 4, passed: 2, skipped: 1, failed: 1 },
    },
    checks: {
        checks: [
            {
                name: "check1",
                errors: 3,
                warnings: 1,
                others: 2,
                issues: { check1: { severity: "warning", count: 1 } },
            },
            {
                name: "check2",
                errors: 7,
                warnings: 3,
                others: 4,
                issues: { check2: { severity: "warning", count: 3 } },
            },
        ],
        totals: { count: 6, errors: 3, warnings: 2, others: 1 },
    },
    totals: { errors: 10, warnings: 4, others: 6 },
    annotations: [
        {
            file: "file1",
            startLine: 1,
            endLine: 2,
            severity: "error",
            message: "message1",
            title: "title1",
            rawDetails: "rawDetails1",
        },
    ],
});

const expectedParams = {
    owner: "anOwner",
    repo: "aRepo",
    name: "aCheckName",
    head_sha: "aCommit",
    status: "completed",
    conclusion: "failure",
    output: {
        title: "aSummary",
        summary: "aSummaryTable",
        annotations: [
            {
                path: "file1",
                start_line: 1,
                end_line: 2,
                annotation_level: "failure",
                message: "message1",
                title: "title1",
                raw_details: "rawDetails1",
            },
        ],
    },
};

import { publishCheck } from "./publishCheck";

describe("publishCheck", () => {
    test.each([[false], [true]])("publishes check [checkExists=%p]", async (checkExists) => {
        listForRef.mockResolvedValue({ data: { check_runs: checkExists ? [{ id: 123 }] : [] } });

        await publishCheck(sampleResults, config);

        expect(getOctokit).toHaveBeenCalledWith("aToken");
        expect(listForRef).toHaveBeenCalledWith({
            owner: "anOwner",
            repo: "aRepo",
            ref: "aCommit",
            check_name: "aCheckName",
            status: "in_progress",
            filter: "latest",
        });

        if (checkExists) {
            expect(create).not.toHaveBeenCalled();
            expect(update).toHaveBeenCalledWith({ ...expectedParams, check_run_id: 123 });
        } else {
            expect(create).toHaveBeenCalledWith(expectedParams);
            expect(update).not.toHaveBeenCalled();
        }
    });

    test("when many annotations, makes multiple API calls", async () => {
        listForRef.mockResolvedValue({ data: { check_runs: [] } });

        const expectedAnnotations = [...Array(138).keys()].map((i) => ({
            path: `file${i}`,
            start_line: 1,
            end_line: 2,
            annotation_level: "warning",
            message: `message${i}`,
            title: `title${i}`,
            raw_details: `rawDetails${i}`,
        }));

        await publishCheck(
            new ParseResults({
                ...sampleResults,
                annotations: [...Array(expectedAnnotations.length).keys()].map((i) => ({
                    file: `file${i}`,
                    startLine: 1,
                    endLine: 2,
                    severity: "warning",
                    message: `message${i}`,
                    title: `title${i}`,
                    rawDetails: `rawDetails${i}`,
                })),
            }),
            config,
        );

        expect(create).toHaveBeenCalledWith({
            ...expectedParams,
            output: {
                ...expectedParams.output,
                annotations: expectedAnnotations.slice(0, 50),
            },
        });
        expect(update).toHaveBeenCalledWith({
            owner: "anOwner",
            repo: "aRepo",
            check_run_id: 456,
            output: {
                ...expectedParams.output,
                annotations: expectedAnnotations.slice(50, 100),
            },
        });
        expect(update).toHaveBeenCalledWith({
            owner: "anOwner",
            repo: "aRepo",
            check_run_id: 456,
            output: {
                ...expectedParams.output,
                annotations: expectedAnnotations.slice(100, 150),
            },
        });
    });

    test.each([
        [403, false, 3],
        [403, true, 3],
        [429, false, "2"],
        [500, true, null],
        [504, false, null],
        [504, true, null],
    ])("when HTTP failure publishing a check, it should retry [http=%p]", async (httpCode, alwaysFail, retryAfter) => {
        jest.useFakeTimers({ advanceTimers: 2 });

        const retryableError = httpCode != 500;
        const error = new RequestErrorMock(httpCode, retryAfter ? { "retry-after": retryAfter } : undefined);
        try {
            listForRef.mockResolvedValue({ data: { check_runs: [] } });
            if (alwaysFail) {
                create.mockRejectedValue(error);
            } else {
                create.mockRejectedValueOnce(error);
                create.mockResolvedValue({ data: { html_url: "aUrl" } });
            }

            const promise = publishCheck(new ParseResults({}), config);
            // noinspection ES6MissingAwait
            jest.runAllTimersAsync();
            if (alwaysFail) {
                await expect(promise).rejects.toEqual(error);
            } else {
                await expect(promise).resolves.toBe("aUrl");
            }

            if (retryableError) {
                expect(coreWarning).toHaveBeenCalledWith(`Request failed with status ${httpCode}: anHttpError`);
                expect(coreInfo).toHaveBeenCalledWith(`Retrying in ${retryAfter || 30} seconds...`);
                expect(create).toHaveBeenCalledTimes(2);
            } else {
                expect(create).toHaveBeenCalledTimes(1);
            }
        } finally {
            jest.useRealTimers();
        }
    });
});

type Headers = { [key: string]: string | number };

class RequestErrorMock extends Error {
    name = "HttpError";
    status: number;
    response?: { headers?: Headers };

    constructor(status: number, headers?: Headers) {
        super("anHttpError");
        this.status = status;
        this.response = { headers };
    }
}
