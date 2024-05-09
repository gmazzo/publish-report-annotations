import {asArray, join, shouldFail} from "./utils";
import {ParseResults} from "./types";
import {summaryOf} from "./summary";

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
