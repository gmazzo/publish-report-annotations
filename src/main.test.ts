const coreNotice = jest.fn();
const coreStartGroup = jest.fn();
const coreEndGroup = jest.fn();
const globCreate = jest.fn().mockImplementation(() => ({
    glob: jest.fn().mockReturnValue(["file1", "file2"])
}));
const processFile = jest.fn().mockResolvedValue({errors: 3, warnings: 2, notices: 1});

jest.mock("@actions/glob", () => ({
    create: globCreate
}));

jest.mock("@actions/core", () => ({
    notice: coreNotice,
    startGroup: coreStartGroup,
    endGroup: coreEndGroup
}));

jest.mock("./processFile", () => ({
    processFile
}));

jest.mock("./config", () => ({
    reports: ["path1", "path2"]
}));

import main from "./main";

describe("main", () => {

    test("delegates to parsers and reports results", async () => {
        await main();

        expect(coreNotice).toHaveBeenCalledWith("Found 2 files to process matching: path1, path2");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing file `file1`");
        expect(coreStartGroup).toHaveBeenCalledWith("Processing file `file2`");
        expect(coreEndGroup).toHaveBeenCalledTimes(2);
        expect(processFile).toHaveBeenCalledWith("file1");
        expect(processFile).toHaveBeenCalledWith("file2");
        expect(coreNotice).toHaveBeenCalledWith("Processed 2 files with:\n- errors: 6\n- warnings: 4\n- notices: 2");
    });

});
