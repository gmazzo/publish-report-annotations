import {asArray, join, shouldFail, summaryOf} from "./utils";

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

    test("singular values", () => {
        const result = summaryOf({errors: 1, warnings: 1, notices: 1});

        expect(result).toBe("1 error, 1 warning and 1 notice");
    });

    test("other values", () => {
        const result = summaryOf({errors: 3, warnings: 2, notices: 0});

        expect(result).toBe("3 errors, 2 warnings and 0 notices");
    });

});

describe("shouldFail", () => {

    test("if error, then true", () => {
        const result = shouldFail({errors: 3, warnings: 2, notices: 1}, false);

        expect(result).toBe(true);
    });

    test("if only warnings, then false", () => {
        const result = shouldFail({errors: 0, warnings: 2, notices: 1}, false);

        expect(result).toBe(false);
    });

    test("if only warnings and counting as errors, then true", () => {
        const result = shouldFail({errors: 0, warnings: 2, notices: 1}, true);

        expect(result).toBe(true);
    });

    test("if only notices, then false", () => {
        const result = shouldFail({errors: 0, warnings: 2, notices: 1}, false);

        expect(result).toBe(false);
    });

});
