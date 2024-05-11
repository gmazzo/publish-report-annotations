import {ParseResults} from "./types";
import {summaryOf, summaryTableOf} from "./summary";

describe("summaryOf", () => {

    test("only tests, all passed", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 3,
                    passed: 3,
                    skipped: 0,
                    failed: 0,
                    errors: 0
                }
            }
        }));

        expect(result).toBe("3 tests passed");
    });

    test("only tests, with failures", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 5,
                    passed: 2,
                    skipped: 1,
                    failed: 1,
                    errors: 1
                }
            }
        }));

        expect(result).toBe("5 tests, 2 passed, 1 skipped, 1 failed, 1 error");
    });

    test("only checks", () => {
        const result = summaryOf(new ParseResults({
            checks: {
                checks: [],
                totals: {
                    count: 5,
                    errors: 3,
                    warnings: 1,
                    others: 1
                }
            }
        }));

        expect(result).toBe("3 errors, 1 warning, 1 other");
    });

    test("tests and checks", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 3,
                    passed: 2,
                    skipped: 1,
                    failed: 0,
                    errors: 0
                }
            },
            checks: {
                checks: [],
                totals: {
                    count: 4,
                    errors: 1,
                    warnings: 3,
                    others: 0
                }
            }
        }));

        expect(result).toBe("3 tests, 2 passed, 1 skipped, checks: 1 error, 3 warnings");
    });

});

describe("summaryTableOf", () => {

    test("produces expected result", () => {
        const html = summaryTableOf(new ParseResults({
            tests: {
                suites: [
                    {name: "suite1", count: 5, passed: 2, errors: 0, skipped: 1, failed: 1, took: 4},
                    {name: "suite2", count: 2, passed: 2, errors: 0, skipped: 0, failed: 0, took: 2}
                ], totals: {count: 4, passed: 2, errors: 0, skipped: 1, failed: 1}
            },
            checks: {
                checks: [
                    {name: "check1", errors: 3, warnings: 1, others: 2},
                    {name: "check2", errors: 7, warnings: 3, others: 4},
                ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
            }
        }));

        expect(html).toBe('|Tests|✅ 2 passed|🟡 1 skipped|❌ 1 failed|⌛ took\n' +
            '|:-|-|-|-|-|\n' +
            '|❌ suite1|2|1|1|4s\n' +
            '|✅ suite2|2|0|0|2s\n' +
            '\n' +
            '|Checks|🛑 3 errors|⚠️ 2 warnings|💡 1 other\n' +
            '|:-|-|-|-|\n' +
            'check1|3|1|2\n' +
            'check2|7|3|4\n');
    });

});
