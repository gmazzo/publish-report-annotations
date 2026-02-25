const getPRFiles = jest.fn().mockReturnValue(["file1", "file2"]);

jest.mock("./getPRFiles", () => ({
    getPRFiles,
}));

import { createFileFilter } from "./createFileFilter";

describe("fileFilter", () => {
    test("should return true, for files in the PR", async () => {
        const fileFilter = await createFileFilter("aToken");

        expect(typeof fileFilter).toBe("function");
        expect(fileFilter("file1")).toBe(true);
        expect(fileFilter("file2")).toBe(true);
    });

    test("should return false, for files not in the PR", async () => {
        const fileFilter = await createFileFilter("aToken");

        expect(typeof fileFilter).toBe("function");
        expect(fileFilter("file3")).toBe(false);
    });

    test("if file is missing, it should not be filtered", async () => {
        const fileFilter = await createFileFilter("aToken");

        expect(typeof fileFilter).toBe("function");
        expect(fileFilter(undefined)).toBe(true);
    });
});
