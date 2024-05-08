import {Parser} from "./parsers/parser";

const junitParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'junit.xml') {
            return new ParsedAnnotations({
                annotations: [{
                    type: "error",
                    message: "junit test failed"
                }],
                totals: {
                    errors: 1,
                    warnings: 0,
                    notices: 0
                }
            });
        }
    })
};

const checkstyleParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'checkstyle.xml') {
            return new ParsedAnnotations({
                annotations: [{
                    type: "error",
                    message: "checkstyle error"
                }, {
                    type: "warning",
                    message: "checkstyle warning"
                }, {
                    type: "notice",
                    message: "checkstyle notice"
                }],
                totals: {
                    errors: 1,
                    warnings: 1,
                    notices: 1
                }
            });
        }
    })
};

const androidLintParser: Parser = {
    parse: jest.fn().mockImplementation(file => {
        if (file == 'lint.xml') {
            return new ParsedAnnotations({
                annotations: [{
                    type: "error",
                    message: "android failure 1"
                }, {
                    type: "error",
                    message: "android failure 2"
                }],
                totals: {
                    errors: 2,
                    warnings: 0,
                    notices: 0
                }
            });
        }
    })
};

const coreError = jest.fn();
const coreWarning = jest.fn();
const coreNotice = jest.fn();

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
import ParsedAnnotations from "./ParsedAnnotations";

describe("processFile", () => {

    test.each([[true],[false]])("for a junit file", async (doNotAnnotate) => {
        const all = await processFile("junit.xml", doNotAnnotate);

        expect(all).toStrictEqual(new ParsedAnnotations({
            annotations: [{
                type: "error",
                message: "junit test failed"
            }],
            totals: {
                errors: 1,
                warnings: 0,
                notices: 0
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("junit.xml");
        expect(checkstyleParser.parse).not.toHaveBeenCalled();
        expect(androidLintParser.parse).not.toHaveBeenCalled();

        expect(coreError).toHaveBeenCalledWith("junit test failed", doNotAnnotate ? undefined : {type: "error", message: "junit test failed"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

    test.each([[true],[false]])("for a checkstyle file", async (doNotAnnotate) => {
        const all = await processFile("checkstyle.xml", doNotAnnotate);

        expect(all).toStrictEqual(new ParsedAnnotations({
            annotations: [{
                type: "error",
                message: "checkstyle error"
            }, {
                type: "warning",
                message: "checkstyle warning"
            }, {
                type: "notice",
                message: "checkstyle notice"
            }],
            totals: {
                errors: 1,
                warnings: 1,
                notices: 1
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("checkstyle.xml");
        expect(checkstyleParser.parse).toHaveBeenCalledWith("checkstyle.xml");
        expect(androidLintParser.parse).not.toHaveBeenCalled();


        expect(coreError).toHaveBeenCalledWith("checkstyle error", doNotAnnotate ? undefined : {type: "error", message: "checkstyle error"});
        expect(coreWarning).toHaveBeenCalledWith("checkstyle warning", doNotAnnotate ? undefined : {type: "warning", message: "checkstyle warning"});
        expect(coreNotice).toHaveBeenCalledWith("checkstyle notice", doNotAnnotate ? undefined : {type: "notice", message: "checkstyle notice"});
    });

    test.each([[true],[false]])("for a android lint file", async (doNotAnnotate) => {
        const all = await processFile("lint.xml", doNotAnnotate);

        expect(all).toStrictEqual(new ParsedAnnotations({
            annotations: [{
                type: "error",
                message: "android failure 1"
            }, {
                type: "error",
                message: "android failure 2"
            }],
            totals: {
                errors: 2,
                warnings: 0,
                notices: 0
            }
        }));

        expect(junitParser.parse).toHaveBeenCalledWith("lint.xml");
        expect(checkstyleParser.parse).toHaveBeenCalledWith("lint.xml");
        expect(androidLintParser.parse).toHaveBeenCalledWith("lint.xml");

        expect(coreError).toHaveBeenCalledWith("android failure 1", doNotAnnotate ? undefined : {type: "error", message: "android failure 1"});
        expect(coreError).toHaveBeenCalledWith("android failure 2", doNotAnnotate ? undefined : {type: "error", message: "android failure 2"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

});
