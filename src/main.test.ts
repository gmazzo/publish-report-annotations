import {ParseResults} from "./types";

const coreDebug = jest.fn();
const coreInfo = jest.fn();
const coreNotice = jest.fn();
const coreStartGroup = jest.fn();
const coreEndGroup = jest.fn();
const coreSetFailed = jest.fn();
const coreSetOutput = jest.fn();
const globCreate = jest.fn().mockImplementation(() => ({
    glob: jest.fn().mockReturnValue(["file1", "file2"])
}));
const processFile = jest.fn().mockReturnValue(new ParseResults({
    tests: { suites: [], totals: { tests: 4, passed: 2, errors: 0, skipped: 1, failed: 1 } },
    checks: { checks: [], totals: { errors: 3, warnings: 2, others: 1 } },
    totals: { errors: 10, warnings: 4, others: 6 }
}));

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
    setOutput: coreSetOutput
}));

jest.mock("./processFile", () => ({
    processFile
}));

const config = {
    reports: ["path1", "path2"],
    warningsAsErrors: false,
    failOnError: false
};
jest.mock("./config", () => (config));

import main from "./main";

describe("main", () => {

    beforeEach(() => {
        config.warningsAsErrors = false;
        config.failOnError = false;
    });

    test("delegates to parsers and reports results", async () => {
        await main();

        expect(coreDebug).toHaveBeenCalledWith("Found 2 files to process matching: path1, path2");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file1`");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing `file2`");
        expect(coreEndGroup).toHaveBeenCalledTimes(2);
        expect(processFile).toHaveBeenCalledWith("file1", true);
        expect(processFile).toHaveBeenCalledWith("file2", true);
        expect(coreNotice).toHaveBeenCalledWith("Processed 2 files: 20 errors, 8 warnings and 12 others");
        expect(coreSetFailed).not.toHaveBeenCalled();
        expect(coreSetOutput).toHaveBeenCalledWith("tests", { tests: 8, passed: 4, errors: 0, skipped: 2, failed: 2 });
        expect(coreSetOutput).toHaveBeenCalledWith("checks", { errors: 6, warnings: 4, others: 2 });
        expect(coreSetOutput).toHaveBeenCalledWith("total", { errors: 20, warnings: 8, others: 12 });
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
