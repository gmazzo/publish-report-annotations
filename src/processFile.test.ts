import {Config, ParseResults} from "./types";
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
const prFilesFilter = jest.fn();
const baseConfig = {prFilesFilter} as unknown as Config ;

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

describe("processFile", () => {

    test.each([[''],['aCheck']])("for a junit file [checkName=%p]", async (checkName) => {
        const config = {...baseConfig, checkName};
        const all = await processFile("junit.xml", config);

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

        expect(junitParser.parse).toHaveBeenCalledWith("junit.xml", config);
        expect(checkstyleParser.parse).not.toHaveBeenCalled();
        expect(androidLintParser.parse).not.toHaveBeenCalled();

        expect(coreError).toHaveBeenCalledWith("junit test failed", checkName ? undefined : {severity: "error", message: "junit test failed"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

    test.each([[''],['aCheck']])("for a checkstyle file [checkName=%p]", async (checkName) => {
        const config = {...baseConfig, checkName};
        const all = await processFile("checkstyle.xml", config);

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

        expect(junitParser.parse).toHaveBeenCalledWith("checkstyle.xml", config);
        expect(checkstyleParser.parse).toHaveBeenCalledWith("checkstyle.xml", config);
        expect(androidLintParser.parse).not.toHaveBeenCalled();


        expect(coreError).toHaveBeenCalledWith("checkstyle error", checkName ? undefined : {severity: "error", message: "checkstyle error"});
        expect(coreWarning).toHaveBeenCalledWith("checkstyle warning", checkName ? undefined : {severity: "warning", message: "checkstyle warning"});
        expect(coreNotice).toHaveBeenCalledWith("checkstyle notice", checkName ? undefined : {severity: "other", message: "checkstyle notice"});
    });

    test.each([[''],['aCheck']])("for a android lint file [checkName=%p]", async (checkName) => {
        const config = {...baseConfig, checkName};
        const all = await processFile("lint.xml", config);

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

        expect(junitParser.parse).toHaveBeenCalledWith("lint.xml", config);
        expect(checkstyleParser.parse).toHaveBeenCalledWith("lint.xml", config);
        expect(androidLintParser.parse).toHaveBeenCalledWith("lint.xml", config);

        expect(coreError).toHaveBeenCalledWith("android failure 1", checkName ? undefined : {severity: "error", message: "android failure 1"});
        expect(coreError).toHaveBeenCalledWith("android failure 2", checkName ? undefined : {severity: "error", message: "android failure 2"});
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

});
