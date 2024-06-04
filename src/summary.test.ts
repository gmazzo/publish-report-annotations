import {ParseResults} from "./types";

jest.mock('./config', () => ({
    summary: 'detailedWithoutPassed'
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

        expect(result).toBe("3 tests ✅ passed");
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

        expect(result).toBe("5 tests: ✅ 2 passed, 🟡 1 skipped, ❌ 1 failed, 🛑 1 error");
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

        expect(result).toBe("🛑 3 errors, ⚠️ 1 warning, 💡 1 other");
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

        expect(result).toBe("3 tests: ✅ 2 passed, 🟡 1 skipped, checks: 🛑 1 error, ⚠️ 3 warnings");
    });

    test("tests and checks, but simplified", () => {
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
        }), true);

        expect(result).toBe("3 tests: ✅ 2, 🟡 1, checks: 🛑 1, ⚠️ 3");
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
                {name: "suite1", errors: 3, warnings: 1, others: 2, issues: { 'check1': { severity: 'warning', count: 1 }, 'check2': { severity: 'error', count: 2 } }},
                {name: "suite2", errors: 7, warnings: 3, others: 4, issues: { 'check2': { severity: 'warning', count: 3 } }},
            ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
        }
    });

    test("when summary is detailed, returns the expected result", () => {
        const summary = summaryTableOf(results, 'detailed');

        expect(summary).toBe('|Tests|✅ 2 passed|🟡 1 skipped|❌ 1 failed|⌛ took\n' +
            '|:-|-|-|-|-|\n' +
            '|❌ suite1|2|1|1|4s\n' +
            '|✅ suite2|2|0|0|2s\n' +
            '\n' +
            '|suite1|🛑 3 errors|⚠️ 1 warning|💡 2 others|\n' +
            '|:-|-|-|-|\n' +
            '|check1|0|1|0|\n' +
            '|check2|2|0|0|\n' +
            '\n' +
            '|suite2|🛑 7 errors|⚠️ 3 warnings|💡 4 others|\n' +
            '|:-|-|-|-|\n' +
            '|check2|0|3|0|\n' +
            '\n');
    });

    test("when summary is detailedWithoutPassed(default), returns the expected result", () => {
        const summary = summaryTableOf(results);

        expect(summary).toBe('|Tests|✅ 2 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 1 failed|⌛ took\n' +
            '|:-|-|-|-|-|\n' +
            '|❌ suite1|2|1|1|4s\n' +
            '[^passedSkipDisclaimer]: ✅ passed suites were not reported\n' +
            '\n' +
            '|suite1|🛑 3 errors|⚠️ 1 warning|💡 2 others|\n' +
            '|:-|-|-|-|\n' +
            '|check1|0|1|0|\n' +
            '|check2|2|0|0|\n' +
            '\n' +
            '|suite2|🛑 7 errors|⚠️ 3 warnings|💡 4 others|\n' +
            '|:-|-|-|-|\n' +
            '|check2|0|3|0|\n' +
            '\n');
    });

    test("when only warnings, returns the expected result", () => {
        const summary = summaryTableOf(new ParseResults({
            checks: {
                checks: [
                    {name: "suite1", errors: 0, warnings: 1, others: 0, issues: { check1: { severity: 'warning', count: 1 } }},
                    {name: "suite2", errors: 0, warnings: 5, others: 0, issues: { check2: { severity: 'warning', count: 2 }, check3: { severity: 'warning', count: 3 }, }},
                ], totals: {count: 6, errors: 0, warnings: 6, others: 0}
            }
        }));

        expect(summary).toBe('|suite1|🛑 0 errors|⚠️ 1 warning|💡 0 others|\n' +
            '|:-|-|-|-|\n' +
            '|check1|0|1|0|\n' +
            '\n' +
            '|suite2|🛑 0 errors|⚠️ 5 warnings|💡 0 others|\n' +
            '|:-|-|-|-|\n' +
            '|check2|0|2|0|\n' +
            '|check3|0|3|0|\n' +
            '\n');
    });

    test("when summary is totals, returns the expected result", () => {
        const summary = summaryTableOf(results, 'totals');

        expect(summary).toBe('Tests: 4 tests: ✅ 2 passed, 🟡 1 skipped, ❌ 1 failed\n' +
            'Checks: 🛑 3 errors, ⚠️ 2 warnings, 💡 1 other');
    });

    test("when summary is off, returns an empty string", () => {
        const summary = summaryTableOf(results, 'off');

        expect(summary).toBe('');
    });

});
