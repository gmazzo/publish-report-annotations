import { Config, ParseResults, TestCase } from "./types";
import { summaryOf, summaryTableOf } from "./summary";

describe("summaryOf", () => {
    test("only tests, all passed", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 3,
                        passed: 3,
                        skipped: 0,
                        failed: 0,
                    },
                },
            }),
        );

        expect(result).toBe("3 tests ✅ passed");
    });

    test("only tests, with failures", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 5,
                        passed: 2,
                        skipped: 1,
                        failed: 1,
                        flaky: 1,
                    },
                },
            }),
        );

        expect(result).toBe("5 tests: ✅ 2 passed (❗1 flaky), 🟡 1 skipped, ❌ 1 failed");
    });

    test("only tests, with retries", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 2,
                        passed: 2,
                        skipped: 0,
                        failed: 0,
                        flaky: 2,
                    },
                },
            }),
        );

        expect(result).toBe("2 tests ✅ passed (2 ❗flaky)");
    });

    test("only checks", () => {
        const result = summaryOf(
            new ParseResults({
                checks: {
                    checks: [],
                    totals: {
                        count: 5,
                        errors: 3,
                        warnings: 1,
                        others: 1,
                    },
                },
            }),
        );

        expect(result).toBe("Checks: 🛑 3 errors, ⚠️ 1 warning, 💡 1 other");
    });

    test("tests and checks", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 3,
                        passed: 2,
                        skipped: 1,
                        failed: 0,
                    },
                },
                checks: {
                    checks: [],
                    totals: {
                        count: 4,
                        errors: 1,
                        warnings: 3,
                        others: 0,
                    },
                },
            }),
        );

        expect(result).toBe("3 tests: ✅ 2 passed, 🟡 1 skipped, checks: 🛑 1 error, ⚠️ 3 warnings");
    });

    test("tests and checks, but simplified", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 3,
                        passed: 2,
                        skipped: 1,
                        failed: 0,
                    },
                },
                checks: {
                    checks: [],
                    totals: {
                        count: 4,
                        errors: 1,
                        warnings: 3,
                        others: 0,
                    },
                },
            }),
            true,
        );

        expect(result).toBe("3 tests: ✅ 2, 🟡 1, checks: 🛑 1, ⚠️ 3");
    });

    test("no issues found", () => {
        const result = summaryOf(new ParseResults({ files: ["aFile"] }), true);

        expect(result).toBe("No issues found");
    });

    test("no reports found", () => {
        const result = summaryOf(new ParseResults({ files: [] }), true);

        expect(result).toBe("❗No report files found");
    });

    test("with failures", () => {
        const result = summaryOf(
            new ParseResults({
                tests: {
                    suites: [],
                    totals: {
                        count: 5,
                        passed: 3,
                        skipped: 1,
                        failed: 1,
                    },
                },
                failures: ["failure1", "failure2"],
            }),
        );

        expect(result).toBe("5 tests: ✅ 3 passed, 🟡 1 skipped, ❌ 1 failed, ‼️ 2 failures");
    });
});

describe("summaryTableOf", () => {
    const results = new ParseResults({
        tests: {
            suites: [
                {
                    name: "suite1",
                    passed: 3,
                    skipped: 1,
                    failed: 1,
                    took: "4",
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
                    took: "2",
                    cases: [
                        { name: "test1", className: "class1", outcome: "passed" },
                        { name: "test2", className: "class2", outcome: "passed" },
                    ],
                },
                {
                    name: "suite3",
                    passed: 2,
                    skipped: 0,
                    failed: 0,
                    took: "2",
                    flaky: 1,
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
                    name: "suite1",
                    errors: 3,
                    warnings: 1,
                    others: 2,
                    issues: { check1: { severity: "warning", count: 1 }, check2: { severity: "error", count: 2 } },
                },
                {
                    name: "suite2",
                    errors: 7,
                    warnings: 3,
                    others: 4,
                    issues: { check2: { severity: "warning", count: 3 } },
                },
            ],
            totals: { count: 6, errors: 3, warnings: 2, others: 1 },
        },
    });

    test("when summary is suites only, returns the expected result", () => {
        const summary = summaryTableOf(results, {
            testsSummary: "suitesOnly",
            checksSummary: "full",
            filterPassedTests: false,
            linksInSummaries: true,
        } as Config);

        expect(summary).toBe(`|Test Suites|✅ 2 passed|🟡 1 skipped|❌ 1 failed|⌛ took
|:-|-|-|-|-
|❌ suite1<sup id="t1"><a href="#t1">#</a></sup>|3|1|1|4
|✅ suite2<sup id="t2"><a href="#t2">#</a></sup>|2|0|0|2
|❎❗suite3<sup id="t3"><a href="#t3">#</a></sup> [^flakyDisclaimer]|2|0|0|2
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|suite1<sup id="c1"><a href="#c1">#</a></sup>|🛑 3 errors|⚠️ 1 warning|💡 2 others|
|:-|-|-|-|
|check1<sup id="c2"><a href="#c2">#</a></sup>|0|1|0|
|check2<sup id="c3"><a href="#c3">#</a></sup>|2|0|0|

|suite2<sup id="c4"><a href="#c4">#</a></sup>|🛑 7 errors|⚠️ 3 warnings|💡 4 others|
|:-|-|-|-|
|check2<sup id="c5"><a href="#c5">#</a></sup>|0|3|0|

`);
    });

    test("when summary is full, returns the expected result", () => {
        const summary = summaryTableOf(results, {
            testsSummary: "full",
            checksSummary: "full",
            filterPassedTests: false,
            linksInSummaries: true,
        } as Config);

        expect(summary).toBe(`|Test Suites|✅ 2 passed|🟡 1 skipped|❌ 1 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌ suite1<sup id="t1"><a href="#t1">#</a></sup></summary><ul><li>✅ test1<sup id="t2"><a href="#t2">#</a></sup></li><li>✅ test2<sup id="t3"><a href="#t3">#</a></sup></li><li>✅ test3<sup id="t4"><a href="#t4">#</a></sup></li><li>❌ test4<sup id="t5"><a href="#t5">#</a></sup></li><li>🟡 test5<sup id="t6"><a href="#t6">#</a></sup></li></ul></details>|3|1|1|4
|<details><summary>✅ suite2<sup id="t7"><a href="#t7">#</a></sup></summary><ul><li>✅ test1<sup id="t8"><a href="#t8">#</a></sup></li><li>✅ test2<sup id="t9"><a href="#t9">#</a></sup></li></ul></details>|2|0|0|2
|<details><summary>❎❗suite3<sup id="t10"><a href="#t10">#</a></sup> [^flakyDisclaimer]</summary><ul><li>✅ test1<sup id="t11"><a href="#t11">#</a></sup></li><li>✅ test2<sup id="t12"><a href="#t12">#</a></sup></li></ul></details>|2|0|0|2
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|suite1<sup id="c1"><a href="#c1">#</a></sup>|🛑 3 errors|⚠️ 1 warning|💡 2 others|
|:-|-|-|-|
|check1<sup id="c2"><a href="#c2">#</a></sup>|0|1|0|
|check2<sup id="c3"><a href="#c3">#</a></sup>|2|0|0|

|suite2<sup id="c4"><a href="#c4">#</a></sup>|🛑 7 errors|⚠️ 3 warnings|💡 4 others|
|:-|-|-|-|
|check2<sup id="c5"><a href="#c5">#</a></sup>|0|3|0|

`);
    });

    test("when summary is without passed, returns the expected result", () => {
        const summary = summaryTableOf(results, {
            testsSummary: "suitesOnly",
            checksSummary: "full",
            filterPassedTests: true,
            linksInSummaries: true,
        } as Config);

        expect(summary).toBe(`|Test Suites|✅ 2 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 1 failed|⌛ took
|:-|-|-|-|-
|❌ suite1<sup id="t1"><a href="#t1">#</a></sup>|3|1|1|4
|❎❗suite3<sup id="t2"><a href="#t2">#</a></sup> [^flakyDisclaimer]|2|0|0|2
[^passedSkipDisclaimer]: ✅ passed suites were not reported
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|suite1<sup id="c1"><a href="#c1">#</a></sup>|🛑 3 errors|⚠️ 1 warning|💡 2 others|
|:-|-|-|-|
|check1<sup id="c2"><a href="#c2">#</a></sup>|0|1|0|
|check2<sup id="c3"><a href="#c3">#</a></sup>|2|0|0|

|suite2<sup id="c4"><a href="#c4">#</a></sup>|🛑 7 errors|⚠️ 3 warnings|💡 4 others|
|:-|-|-|-|
|check2<sup id="c5"><a href="#c5">#</a></sup>|0|3|0|

`);
    });

    test("when only warnings, returns the expected result", () => {
        const summary = summaryTableOf(
            new ParseResults({
                checks: {
                    checks: [
                        {
                            name: "suite1",
                            errors: 0,
                            warnings: 1,
                            others: 0,
                            issues: { check1: { severity: "warning", count: 1 } },
                        },
                        {
                            name: "suite2",
                            errors: 0,
                            warnings: 5,
                            others: 0,
                            issues: {
                                check2: { severity: "warning", count: 2 },
                                check3: { severity: "warning", count: 3 },
                            },
                        },
                    ],
                    totals: { count: 6, errors: 0, warnings: 6, others: 0 },
                },
            }),
            { testsSummary: "off", checksSummary: "full", filterPassedTests: false, linksInSummaries: true } as Config,
        );

        expect(summary).toBe(`|suite1<sup id="c1"><a href="#c1">#</a></sup>|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|check1<sup id="c2"><a href="#c2">#</a></sup>|0|1|0|

|suite2<sup id="c3"><a href="#c3">#</a></sup>|🛑 0 errors|⚠️ 5 warnings|💡 0 others|
|:-|-|-|-|
|check2<sup id="c4"><a href="#c4">#</a></sup>|0|2|0|
|check3<sup id="c5"><a href="#c5">#</a></sup>|0|3|0|

`);
    });

    test("when summary is totals, returns the expected result", () => {
        const summary = summaryTableOf(results, {
            testsSummary: "totals",
            checksSummary: "totals",
            filterPassedTests: false,
        } as Config);

        expect(summary).toBe(
            "Tests: 4 tests: ✅ 2 passed, 🟡 1 skipped, ❌ 1 failed\n" +
                "Checks: 🛑 3 errors, ⚠️ 2 warnings, 💡 1 other",
        );
    });

    test("when summary is totals but with failures, returns the expected result", () => {
        const summary = summaryTableOf(
            {
                ...results,
                failures: ["failure1", "failure2", "failure3"],
            },
            {
                testsSummary: "totals",
                checksSummary: "totals",
                filterPassedTests: false,
            } as Config,
        );

        expect(summary).toBe(
            `
Tests: 4 tests: ✅ 2 passed, 🟡 1 skipped, ❌ 1 failed
Checks: 🛑 3 errors, ⚠️ 2 warnings, 💡 1 other

> [!CAUTION]
> There were some failures processing report files:
> - \`failure1\`
> - \`failure2\`
> - \`failure3\``.trimStart(),
        );
    });

    test("when summary is off, returns an empty string", () => {
        const summary = summaryTableOf(results, {
            testsSummary: "off",
            checksSummary: "off",
            filterPassedTests: false,
        } as Config);

        expect(summary).toBe("");
    });

    test.each([
        [false, ["`filterPassedTests` from `false` to `true`"]],
        [true, ["`testsSummary` from `full` to `suitesOnly`", "`filterPassedTests` from `false` to `true`"]],
    ])("when summary is too long, reduces it", (manyTestsFailing, expectedChanges) => {
        const results = new ParseResults();
        for (let i = 0; i < 100; i++) {
            const cases: TestCase[] = [];
            for (let j = 0; j < 100; j++) {
                cases.push({
                    name: `test${j}`,
                    className: "class",
                    outcome: manyTestsFailing || i % 10 == 1 ? "failed" : "passed",
                });
            }
            results.addTestSuite({ name: `suite${i}`, passed: 1, skipped: 0, failed: 0, took: "1", cases });
        }
        const summary = summaryTableOf(results, {
            testsSummary: "full",
            checksSummary: "full",
            filterPassedTests: false,
            linksInSummaries: true,
        } as Config);
        const note = summary.substring(summary.indexOf("[^settingsChanged]: "));

        expect(summary.length).toBeLessThan(65500);
        expect(summary).toContain("Test Suites[^settingsChanged]|");
        expect(note).toBe(
            `[^settingsChanged]: Summary table was too long (623.3KB), reduced the following to make it fit into the limits:${expectedChanges.map((it) => `<br/>- ${it}`).join("")}`,
        );
    });
});
