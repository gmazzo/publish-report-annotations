import { asArray, hasErrors, join, shouldFail } from "./utils";
import { Config, ParseResults } from "./types";

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

describe("shouldFail", () => {
    test("if error when no files, then true", () => {
        const config = { failIfNoReportsFound: true } as Config;
        const result = shouldFail(new ParseResults(), config);

        expect(result).toBe(true);
    });

    test("if failed tests, then true", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(
            new ParseResults({ tests: { totals: { count: 5, passed: 3, failed: 3, skipped: 0 }, suites: [] } }),
            config,
        );

        expect(result).toBe(true);
    });

    test("if failed checks, then true", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(
            new ParseResults({ checks: { totals: { count: 5, errors: 3, warnings: 2, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(
            new ParseResults({ checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const config = { warningsAsErrors: true } as Config;
        const result = shouldFail(
            new ParseResults({ checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(true);
    });

    test("if only others, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(
            new ParseResults({ checks: { totals: { count: 1, errors: 0, warnings: 0, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(false);
    });
});

describe("hasErrors", () => {
    test("if error, then true", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(
            new ParseResults({ tests: { totals: { count: 5, passed: 3, failed: 3, skipped: 0 }, suites: [] } }),
            config,
        );

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(
            new ParseResults({ checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const config = { warningsAsErrors: true } as Config;
        const result = hasErrors(
            new ParseResults({ checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(true);
    });

    test("if only others, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(
            new ParseResults({ checks: { totals: { count: 1, errors: 0, warnings: 0, others: 1 }, checks: [] } }),
            config,
        );

        expect(result).toBe(false);
    });
});

describe("String.prototype.truncate", () => {
    test("when shorter than limit, returns same string", () => {
        const result = "short string".truncate(50);

        expect(result).toBe("short string");
    });

    test("when same as limit, returns same string", () => {
        const result = "short string".truncate(12);

        expect(result).toBe("short string");
    });

    test("when longer than limit, returns truncated string", () => {
        const result = "this is a very long string".truncate(13);

        expect(result).toBe("this is a …");
        expect(Buffer.byteLength(result, "utf-8")).toBe(13);
    });

    test("when cutting in the middle of a multi-byte character, replaces it with ellipsis", () => {
        const result = "This is a test 🚀 string".truncate(17);

        expect(result).toBe("This is a test…");
        expect(Buffer.byteLength(result, "utf-8")).toBe(17);
    });

    test("when cutting a multi-byte character at the limit, replaces it with ellipsis", () => {
        const result = "This is a test 🚀 string".truncate(18);

        expect(result).toBe("This is a test …");
        expect(Buffer.byteLength(result, "utf-8")).toBe(18);
    });

    test("when cutting a multi-byte character just after the limit, replaces it with ellipsis", () => {
        const result = "This is a test 🚀 string".truncate(19);

        expect(result).toBe("This is a test …");
        expect(Buffer.byteLength(result, "utf-8")).toBe(18); // a � will be removed
    });

    test("when cutting a multi-byte character well after the limit, keeps it", () => {
        const result = "This is a test 🚀 string with emoji".truncate(29);

        expect(result).toBe("This is a test 🚀 string…");
        expect(Buffer.byteLength(result, "utf-8")).toBe(29);
    });
});
