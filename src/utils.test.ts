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

    test("if error, then true", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(new ParseResults({ totals: { errors: 3, warnings: 2, others: 1 } }), config);

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const config = { warningsAsErrors: true } as Config;
        const result = shouldFail(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(true);
    });

    test("if only others, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = shouldFail(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(false);
    });
});

describe("hasErrors", () => {
    test("if error, then true", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(new ParseResults({ totals: { errors: 3, warnings: 2, others: 1 } }), config);

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const config = { warningsAsErrors: true } as Config;
        const result = hasErrors(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(true);
    });

    test("if only others, then false", () => {
        const config = { warningsAsErrors: false } as Config;
        const result = hasErrors(new ParseResults({ totals: { errors: 0, warnings: 2, others: 1 } }), config);

        expect(result).toBe(false);
    });
});
