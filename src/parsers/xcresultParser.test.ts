import { Config, ParseResults } from "../types";
import { readFile } from "../readFile";

const resolveFile = jest.fn().mockImplementation((file: string) => `<projectTestSrc>/${file}`);

jest.mock("./resolveFile", () => ({
    resolveFile,
}));

const config = {} as unknown as Config;

import { xcresultParser, XCResultData } from "./xcresultParser";

describe("xcresultParser", () => {
    test("given xcresult json should obtain annotations", async () => {
        const data = readFile<XCResultData>("samples/test-results.xcresult.json", config)!;
        const results = await xcresultParser.process(data(), config);

        expect(results).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        endLine: 20,
                        file: "<projectTestSrc>/SampleTests.swift",
                        message: "XCTAssertTrue failed",
                        severity: "error",
                        startLine: 20,
                        title: "testFailure()",
                    },
                    {
                        endLine: 29,
                        file: "<projectTestSrc>/SampleTests.swift",
                        message: "XCTAssertTrue failed",
                        severity: "error",
                        startLine: 29,
                        title: "testFlaky()",
                    },
                ],
                checks: {
                    checks: [],
                    totals: {
                        count: 0,
                        errors: 0,
                        others: 0,
                        warnings: 0,
                    },
                },
                files: [],
                tests: {
                    suites: [
                        {
                            cases: [
                                {
                                    className: "SampleTests.swift",
                                    name: "testFailure()",
                                    outcome: "failed",
                                    took: "0,36s",
                                },
                                {
                                    className: "SampleTests.swift",
                                    name: "testFlaky()",
                                    outcome: "failed",
                                    took: "0,0012s",
                                },
                                {
                                    className: "SampleTests",
                                    name: "testSkipped()",
                                    outcome: "skipped",
                                    took: "0,005s",
                                },
                                {
                                    className: "SampleTests",
                                    name: "testSuccess()",
                                    outcome: "passed",
                                    took: "0,00072s",
                                },
                            ],
                            failed: 2,
                            flaky: 0,
                            name: "SampleTests",
                            passed: 1,
                            skipped: 1,
                        },
                    ],
                    totals: {
                        count: 4,
                        failed: 2,
                        flaky: 0,
                        passed: 1,
                        skipped: 1,
                    },
                },
            }),
        );
    });

    test("given another xcresult json should obtain annotations", async () => {
        const data = readFile<XCResultData>("samples/test-results-other.xcresult.json", config)!;
        const results = await xcresultParser.process(data(), config);

        expect(results).toStrictEqual(
            new ParseResults({
                annotations: [],
                checks: {
                    checks: [],
                    totals: {
                        count: 0,
                        errors: 0,
                        others: 0,
                        warnings: 0,
                    },
                },
                files: [],
                tests: {
                    suites: [
                        {
                            cases: [
                                {
                                    className: "TrackingUIGoogleMapTests",
                                    name: "exampleUsage()",
                                    outcome: "passed",
                                },
                            ],
                            failed: 0,
                            flaky: 0,
                            name: "TrackingUIGoogleMapTests",
                            passed: 1,
                            skipped: 0,
                        },
                        {
                            cases: [
                                {
                                    className: "TrackingUITests",
                                    name: "example()",
                                    outcome: "passed",
                                },
                            ],
                            failed: 0,
                            flaky: 0,
                            name: "TrackingUITests",
                            passed: 1,
                            skipped: 0,
                        },
                    ],
                    totals: {
                        count: 2,
                        failed: 0,
                        flaky: 0,
                        passed: 2,
                        skipped: 0,
                    },
                },
            }),
        );
    });

    test("given a retry xcresult json should obtain annotations", async () => {
        const data = readFile<XCResultData>("samples/test-results-retry.xcresult.json", config)!;
        const results = await xcresultParser.process(data(), config);

        expect(results).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        endLine: 20,
                        file: "<projectTestSrc>/SampleTests.swift",
                        message: "Failed after 3 retries: XCTAssertTrue failed",
                        severity: "error",
                        startLine: 20,
                        title: "testFailure()",
                    },
                    {
                        message: "⚠️ Passed after 1 retry",
                        severity: "warning",
                        title: "(❗Flaky) testFlaky()",
                    },
                ],
                checks: {
                    checks: [],
                    totals: {
                        count: 0,
                        errors: 0,
                        others: 0,
                        warnings: 0,
                    },
                },
                files: [],
                tests: {
                    suites: [
                        {
                            cases: [
                                {
                                    className: "SampleTests.swift",
                                    name: "testFailure()",
                                    outcome: "failed",
                                    retries: 2,
                                    took: "0,25s",
                                },
                                {
                                    className: "SampleTests",
                                    name: "testFlaky()",
                                    outcome: "flaky",
                                    retries: 1,
                                    took: "0,0012s",
                                },
                                {
                                    className: "SampleTests",
                                    name: "testSkipped()",
                                    outcome: "skipped",
                                    retries: 0,
                                    took: "0,006s",
                                },
                                {
                                    className: "SampleTests",
                                    name: "testSuccess()",
                                    outcome: "passed",
                                    took: "0,00041s",
                                },
                            ],
                            failed: 1,
                            flaky: 1,
                            name: "SampleTests",
                            passed: 2,
                            skipped: 1,
                        },
                    ],
                    totals: {
                        count: 4,
                        failed: 1,
                        flaky: 1,
                        passed: 2,
                        skipped: 1,
                    },
                },
            }),
        );
    });
});
