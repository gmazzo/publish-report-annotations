import {ParseResults} from "./types";

const coreDebug = jest.fn();
const coreInfo = jest.fn();
const coreNotice = jest.fn();
const coreStartGroup = jest.fn();
const coreEndGroup = jest.fn();
const coreSetFailed = jest.fn();
const coreSetOutput = jest.fn();
const coreSummaryAddRaw = jest.fn();
const coreSummaryWrite = jest.fn();
const globCreate = jest.fn().mockImplementation(() => ({
    glob: jest.fn().mockReturnValue(["file1", "file2"])
}));
const processFile = jest.fn().mockReturnValue(new ParseResults({
    tests: { suites: [], totals: { count: 4, passed: 2, skipped: 1, failed: 1 } },
    checks: { checks: [], totals: { count: 6, errors: 3, warnings: 2, others: 1 } },
    totals: { errors: 10, warnings: 4, others: 6 }
}));

const config = {
    reports: ["path1", "path2"],
    workflowSummary: true,
    warningsAsErrors: false,
    failOnError: false,
    filterChecks: false,
};
const readConfig = jest.fn().mockReturnValue(config);

jest.mock("@actions/glob", () => ({
    create: globCreate
}));

jest.mock("@actions/core", () => ({
    debug: coreDebug,
    notice: coreNotice,
    info: coreInfo,
    startGroup: coreStartGroup,
    endGroup: coreEndGroup,
    setFailed: coreSetFailed,
    setOutput: coreSetOutput,
    summary: { addRaw: coreSummaryAddRaw, write: coreSummaryWrite }
}));

jest.mock("./processFile", () => ({
    processFile
}));

jest.mock("./readConfig", () => ({
    readConfig
}));

import main from "./main";

describe("main", () => {

    test("delegates to parsers and reports results", async () => {
        await main();

        expect(coreDebug).toHaveBeenCalledWith("Found 2 files to process matching: path1, path2");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file1`");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file2`");
        expect(coreEndGroup).toHaveBeenCalledTimes(2);
        expect(processFile).toHaveBeenCalledWith("file1", config);
        expect(processFile).toHaveBeenCalledWith("file2", config);
        expect(coreNotice).toHaveBeenCalledWith("Processed 2 files: 8 tests: ✅ 4 passed, 🟡 2 skipped, ❌ 2 failed, checks: 🛑 6 errors, ⚠️ 4 warnings, 💡 2 others");
        expect(coreSetFailed).not.toHaveBeenCalled();
        expect(coreSetOutput).toHaveBeenCalledWith("tests", { count: 8, passed: 4, skipped: 2, failed: 2 });
        expect(coreSetOutput).toHaveBeenCalledWith("checks", { count: 12, errors: 6, warnings: 4, others: 2 });
        expect(coreSetOutput).toHaveBeenCalledWith("total", { errors: 20, warnings: 8, others: 12 });
        expect(coreSummaryAddRaw).toHaveBeenCalled();
        expect(coreSummaryWrite).toHaveBeenCalled();
    });

    test("if error and should fail, expect to fail", async () => {
        config.failOnError = true;
        processFile.mockResolvedValue(new ParseResults({
            totals: {errors: 3, warnings: 0, others: 1}
        }));

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 6 errors and 0 warnings.");
    });

    test("if warnings and should fail, expect to fail", async () => {
        config.warningsAsErrors = true;
        config.failOnError = true;
        processFile.mockResolvedValue(new ParseResults({
            totals: {errors: 0, warnings: 2, others: 1}
        }));

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 0 errors and 4 warnings.");
    });

});
