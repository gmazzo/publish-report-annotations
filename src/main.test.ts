import { jest, describe, test, expect } from "@jest/globals";
import { ParseResults } from "./types";
import { MAX_ANNOTATIONS_PER_API_CALL } from "./publishCheck";

const coreDebug = jest.fn();
const coreInfo = jest.fn();
const coreNotice = jest.fn();
const coreError = jest.fn();
const coreStartGroup = jest.fn();
const coreEndGroup = jest.fn();
const coreSetFailed = jest.fn();
const coreSetOutput = jest.fn();
const coreSummaryAddRaw = jest.fn();
const coreSummaryWrite = jest.fn();
const globCreate = jest.fn().mockImplementation(() => ({
    glob: jest.fn().mockReturnValue(["file1", "file2"]),
}));
const reader1 = () => ({ file: "file1" });
const reader2 = () => ({ file: "file2" });
const readFile = jest.fn().mockImplementation((file) => {
    switch (file) {
        case "file1":
            return reader1;
        case "file2":
            return reader2;
        default:
            throw new Error(`Unexpected file: ${file}`);
    }
});
const processFile = jest.fn().mockReturnValue(
    new ParseResults({
        tests: { suites: [], totals: { count: 4, passed: 2, skipped: 1, failed: 1 } },
        checks: { checks: [], totals: { count: 6, errors: 3, warnings: 2, others: 1 } },
    }),
);
const publishCheck = jest.fn().mockReturnValue({ id: 12345, html_url: "https://example.com/check/12345" });

const config = {
    reports: ["path1", "path2"],
    workflowSummary: true,
    warningsAsErrors: false,
    failOnError: false,
    filterChecks: false,
    checkName: "",
};
const readConfig = jest.fn().mockReturnValue(config);

jest.unstable_mockModule("@actions/glob", () => ({
    create: globCreate,
}));

jest.unstable_mockModule("@actions/core", () => ({
    debug: coreDebug,
    notice: coreNotice,
    info: coreInfo,
    error: coreError,
    startGroup: coreStartGroup,
    endGroup: coreEndGroup,
    setFailed: coreSetFailed,
    setOutput: coreSetOutput,
    summary: { addRaw: coreSummaryAddRaw, write: coreSummaryWrite },
}));

jest.unstable_mockModule("./readFile", () => ({
    readFile,
}));

jest.unstable_mockModule("./processFile", () => ({
    processFile,
}));

jest.unstable_mockModule("./readConfig", () => ({
    readConfig,
}));

jest.unstable_mockModule("./publishCheck", () => ({
    MAX_ANNOTATIONS_PER_API_CALL: MAX_ANNOTATIONS_PER_API_CALL,
    publishCheck,
}));

const main = (await import("./main")).default;

describe("main", () => {
    test("delegates to parsers and reports results", async () => {
        await main();

        expect(coreDebug).toHaveBeenCalledWith("Found 2 files to process matching: path1, path2");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file1`");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file2`");
        expect(coreEndGroup).toHaveBeenCalledTimes(2);
        expect(processFile).toHaveBeenCalledWith(reader1, config);
        expect(processFile).toHaveBeenCalledWith(reader2, config);
        expect(coreNotice).toHaveBeenCalledWith(
            "Processed 2 files: 8 tests: ✅ 4 passed, 🟡 2 skipped, ❌ 2 failed, checks: 🛑 6 errors, ⚠️ 4 warnings, 💡 2 others",
        );
        expect(coreSetFailed).not.toHaveBeenCalled();
        expect(coreSetOutput).toHaveBeenCalledWith("tests", { count: 8, passed: 4, skipped: 2, failed: 2 });
        expect(coreSetOutput).toHaveBeenCalledWith("checks", { count: 12, errors: 6, warnings: 4, others: 2 });
        expect(coreSummaryAddRaw).toHaveBeenCalled();
        expect(coreSummaryWrite).toHaveBeenCalled();
    });

    test("if error and should fail, expect to fail", async () => {
        config.failOnError = true;
        processFile.mockReturnValue(
            new ParseResults({
                checks: { totals: { count: 4, errors: 3, warnings: 0, others: 1 }, checks: [] },
            }),
        );

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 6 errors and 0 warnings.");
    });

    test("if warnings and should fail, expect to fail", async () => {
        config.warningsAsErrors = true;
        config.failOnError = true;
        processFile.mockReturnValue(
            new ParseResults({
                checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] },
            }),
        );

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 0 errors and 4 warnings.");
    });

    test("if no permission to create check, should log but not fail", async () => {
        const err = Error("Resource not accessible by integration");

        config.checkName = "aCheck";
        processFile.mockReturnValue(
            new ParseResults({
                checks: { totals: { count: 3, errors: 0, warnings: 2, others: 1 }, checks: [] },
            }),
        );
        publishCheck.mockImplementation(async () => {
            throw err;
        });

        await main();

        expect(coreError).toHaveBeenCalledWith("Failed to publish check 'aCheck':");
        expect(coreError).toHaveBeenCalledWith(err);
    });
});
