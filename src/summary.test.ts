import {ParseResults} from "./types";

jest.mock('./config', () => ({
    summary: 'detailed'
}));

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

    const results = new ParseResults({
        tests: {
            suites: [
                {name: "suite1", count: 5, passed: 2, errors: 0, skipped: 1, failed: 1, took: 4},
                {name: "suite2", count: 2, passed: 2, errors: 0, skipped: 0, failed: 0, took: 2}
            ], totals: {count: 4, passed: 2, errors: 0, skipped: 1, failed: 1}
        },
        checks: {
            checks: [
                {name: "suite1", errors: 3, warnings: 1, others: 2, issues: { 'check1': { level: 'warning', count: 1 }, 'check2': { level: 'error', count: 2 } }},
                {name: "suite2", errors: 7, warnings: 3, others: 4, issues: { 'check2': { level: 'warning', count: 3 } }},
            ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
        }
    });

    test("when summary is detailed(default), returns the expected result", () => {
        const summary = summaryTableOf(results);

        expect(summary).toBe('|Tests|✅ 2 passed|🟡 1 skipped|❌ 1 failed|⌛ took\n' +
            '|:-|-|-|-|-|\n' +
            '|❌ suite1|2|1|1|4s\n' +
            '|✅ suite2|2|0|0|2s\n' +
            '\n' +
            '|suite2|🛑 7 errors|⚠️ 3 warnings|💡 4 others\n' +
            '|:-|-|-|-|\n' +
            '|check2|0|3|0|\n' +
            '\n');
    });

    test("when summary is totals, returns the expected result", () => {
        const summary = summaryTableOf(results, 'totals');

        expect(summary).toBe('Tests: 4 tests, ✅ 2 passed, 🟡 1 skipped, ❌ 1 failed\n' +
            'Checks: 🛑 3 errors, ⚠️ 2 warnings, 💡 1 other');
    });

    test("when summary is off, returns an empty string", () => {
        const summary = summaryTableOf(results, 'off');

        expect(summary).toBe('');
    });

});
