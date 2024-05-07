const coreDebug = jest.fn();
const coreInfo = jest.fn();
const coreNotice = jest.fn();
const coreStartGroup = jest.fn();
const coreEndGroup = jest.fn();
const coreSetFailed = jest.fn();
const globCreate = jest.fn().mockImplementation(() => ({
    glob: jest.fn().mockReturnValue(["file1", "file2"])
}));
const processFile = jest.fn().mockResolvedValue({errors: 3, warnings: 2, notices: 1});

jest.mock("@actions/glob", () => ({
    create: globCreate
}));

jest.mock("@actions/core", () => ({
    debug: coreDebug,
    notice: coreNotice,
    info: coreInfo,
    startGroup: coreStartGroup,
    endGroup: coreEndGroup,
    setFailed: coreSetFailed
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
        expect(processFile).toHaveBeenCalledWith("file1");
        expect(processFile).toHaveBeenCalledWith("file2");
        expect(coreInfo).toHaveBeenCalledWith("Processed 2 files: 6 error(s), 4 warning(s) and 2 notice(s)");
        expect(coreSetFailed).not.toHaveBeenCalled();
    });

    test("if error and should fail, expect to fail", async () => {
        config.failOnError = true;
         processFile.mockResolvedValue({errors: 3, warnings: 0, notices: 1});

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 6 errors and 0 warnings.");
    });

    test("if warnings and should fail, expect to fail", async () => {
        config.warningsAsErrors = true;
        config.failOnError = true;
        processFile.mockResolvedValue({errors: 0, warnings: 2, notices: 1});

        await main();

        expect(coreSetFailed).toHaveBeenCalledWith("Found 0 errors and 4 warnings.");
    });

});
