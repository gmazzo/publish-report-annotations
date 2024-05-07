import {asArray, join} from "./utils";

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
