import {asArray, join, shouldFail, summaryOf} from "./utils";
import {ParseResults} from "./types";

describe("asArray", () => {

    test("when single element, returns it as an array", () => {
        const result = asArray("value");

        expect(result).toStrictEqual(["value"]);
    });

    test("when multiple elements, returns the same", () => {
        const result = asArray(["value1", "value2", "value3"]);

        expect(result).toStrictEqual(["value1", "value2", "value3"]);
    });

    test("when not a value, returns an empty array", () => {
        const result = asArray(undefined);

        expect(result).toStrictEqual([]);
    });

});

describe("join", () => {

    test("joins multiple non black elements", () => {
        const result = join("text1", "   text2", "text3   ");

        expect(result).toBe(`text1\n   text2\ntext3   `);
    });

    test("joins multiple non black elements, when some are empty or undefined", () => {
        const result = join("text1", null, "   text2", undefined, "", "text3   ");

        expect(result).toBe(`text1\n   text2\ntext3   `);
    });

});

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

describe("shouldFail", () => {

    test("if error, then true", () => {
        const result = shouldFail({errors: 3, warnings: 2, others: 1}, false);

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const result = shouldFail({errors: 0, warnings: 2, others: 1}, false);

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const result = shouldFail({errors: 0, warnings: 2, others: 1}, true);

        expect(result).toBe(true);
    });

    test("if only others, then false", () => {
        const result = shouldFail({errors: 0, warnings: 2, others: 1}, false);

        expect(result).toBe(false);
    });

});
