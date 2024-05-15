import {Parser} from "./parsers/parser";

const junitParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'junit.xml') {
            return new ParseResults({
                annotations: [{
                    severity: "error",
                    message: "junit test failed"
                }],
                totals: {
                    errors: 1,
                    warnings: 0,
                    others: 0
                }
            });
        }
    })
};

const checkstyleParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'checkstyle.xml') {
            return new ParseResults({
                annotations: [{
                    severity: "error",
                    message: "checkstyle error"
                }, {
                    severity: "warning",
                    message: "checkstyle warning"
                }, {
                    severity: "other",
                    message: "checkstyle notice"
                }],
                totals: {
                    errors: 1,
                    warnings: 1,
                    others: 1
                }
            });
        }
    })
};

const androidLintParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'lint.xml') {
            return new ParseResults({
                annotations: [{
                    severity: "error",
                    message: "android failure 1"
                }, {
                    severity: "error",
                    message: "android failure 2"
                }],
                totals: {
                    errors: 2,
                    warnings: 0,
                    others: 0
                }
            });
        }
    })
};

const coreError = jest.fn();
const coreWarning = jest.fn();
const coreNotice = jest.fn();
const fileFilter = jest.fn();

jest.mock("./parsers/junitParser", () => ({
    junitParser
}));

jest.mock("./parsers/checkstyleParser", () => ({
    checkstyleParser
}));

jest.mock("./parsers/androidLintParser", () => ({
    androidLintParser
}));

jest.mock("@actions/core", () => ({
    error: coreError,
    warning: coreWarning,
    notice: coreNotice
}));

import {processFile} from "./processFile";
import {ParseResults} from "./types";

describe("processFile", () => {

    test.each([[true],[false]])("for a junit file [doNotAnnotate=%p]", async (doNotAnnotate) => {
        const all = await processFile("junit.xml", doNotAnnotate, fileFilter);

        expect(all).toStrictEqual(new ParseResults({
            annotations: [{
                severity: "error",
                message: "junit test failed"
            }],
            totals: {
                errors: 1,
                warnings: 0,
                others: 0
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("junit.xml", fileFilter);
        expect(checkstyleParser.parse).not.toHaveBeenCalled();
        expect(androidLintParser.parse).not.toHaveBeenCalled();

        expect(coreError).toHaveBeenCalledWith("junit test failed", doNotAnnotate ? undefined : {severity: "error", message: "junit test failed"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

    test.each([[true],[false]])("for a checkstyle file [doNotAnnotate=%p]", async (doNotAnnotate) => {
        const all = await processFile("checkstyle.xml", doNotAnnotate, fileFilter);

        expect(all).toStrictEqual(new ParseResults({
            annotations: [{
                severity: "error",
                message: "checkstyle error"
            }, {
                severity: "warning",
                message: "checkstyle warning"
            }, {
                severity: "other",
                message: "checkstyle notice"
            }],
            totals: {
                errors: 1,
                warnings: 1,
                others: 1
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("checkstyle.xml", fileFilter);
        expect(checkstyleParser.parse).toHaveBeenCalledWith("checkstyle.xml", fileFilter);
        expect(androidLintParser.parse).not.toHaveBeenCalled();


        expect(coreError).toHaveBeenCalledWith("checkstyle error", doNotAnnotate ? undefined : {severity: "error", message: "checkstyle error"});
        expect(coreWarning).toHaveBeenCalledWith("checkstyle warning", doNotAnnotate ? undefined : {severity: "warning", message: "checkstyle warning"});
        expect(coreNotice).toHaveBeenCalledWith("checkstyle notice", doNotAnnotate ? undefined : {severity: "other", message: "checkstyle notice"});
    });

    test.each([[true],[false]])("for a android lint file [doNotAnnotate=%p]", async (doNotAnnotate) => {
        const all = await processFile("lint.xml", doNotAnnotate, fileFilter);

        expect(all).toStrictEqual(new ParseResults({
            annotations: [{
                severity: "error",
                message: "android failure 1"
            }, {
                severity: "error",
                message: "android failure 2"
            }],
            totals: {
                errors: 2,
                warnings: 0,
                others: 0
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("lint.xml", fileFilter);
        expect(checkstyleParser.parse).toHaveBeenCalledWith("lint.xml", fileFilter);
        expect(androidLintParser.parse).toHaveBeenCalledWith("lint.xml", fileFilter);

        expect(coreError).toHaveBeenCalledWith("android failure 1", doNotAnnotate ? undefined : {severity: "error", message: "android failure 1"});
        expect(coreError).toHaveBeenCalledWith("android failure 2", doNotAnnotate ? undefined : {severity: "error", message: "android failure 2"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

});
