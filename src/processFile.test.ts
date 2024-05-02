import {Parser} from "./parsers/parser";

const androidLintParser: Parser = {
    parse: jest.fn().mockReturnValue([{
        type: "error",
        message: "android failure 1"
    }, {
        type: "error",
        message: "android failure 2"
    }])
};

const checkstyleParser: Parser = {
    parse: jest.fn().mockReturnValue([{
        type: "error",
        message: "checkstyle error"
    }, {
        type: "warning",
        message: "checkstyle warning"
    }, {
        type: "notice",
        message: "checkstyle notice"
    }])
};

const junitParser: Parser = {
    parse: jest.fn().mockReturnValue([{
        type: "error",
        message: "junit test failed"
    }])
};

const coreError = jest.fn();
const coreWarning = jest.fn();
const coreNotice = jest.fn();

jest.mock("./parsers/androidLintParser", () => ({
    androidLintParser
}));

jest.mock("./parsers/checkstyleParser", () => ({
    checkstyleParser
}));

jest.mock("./parsers/junitParser", () => ({
    junitParser
}));

jest.mock("@actions/core", () => ({
    error: coreError,
    warning: coreWarning,
    notice: coreNotice
}));

import {processFile} from "./processFile";

describe("processFile", () => {

    test("delegates to parsers and reports results", async () => {
        const totals = await processFile("aFile");

        expect(totals).toStrictEqual({
            errors: 4,
            warnings: 1,
            notices: 1
        });

        expect(androidLintParser.parse).toHaveBeenCalledWith("aFile");
        expect(checkstyleParser.parse).toHaveBeenCalledWith("aFile");
        expect(junitParser.parse).toHaveBeenCalledWith("aFile");

        expect(coreError).toHaveBeenCalledWith("android failure 1", {type: "error", message: "android failure 1"});
        expect(coreError).toHaveBeenCalledWith("android failure 2", {type: "error", message: "android failure 2"});
        expect(coreError).toHaveBeenCalledWith("checkstyle error", {type: "error", message: "checkstyle error"});
        expect(coreWarning).toHaveBeenCalledWith("checkstyle warning", {type: "warning", message: "checkstyle warning"});
        expect(coreNotice).toHaveBeenCalledWith("checkstyle notice", {type: "notice", message: "checkstyle notice"});
        expect(coreError).toHaveBeenCalledWith("junit test failed", {type: "error", message: "junit test failed"});
    });

});
