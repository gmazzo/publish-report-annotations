import { Config, ParseResults } from "./types";
import { Parser } from "./parsers/parser";

const junitData = { junit: true };
const junitParser: Parser<object> = {
    process: jest.fn().mockImplementation((data) => {
        if (data === junitData) {
            return new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "junit test failed",
                    },
                ],
                totals: {
                    errors: 1,
                    warnings: 0,
                    others: 0,
                },
            });
        }
    }),
};

const checkstyleData = { checkstyle: true };
const checkstyleParser: Parser<object> = {
    process: jest.fn().mockImplementation((data) => {
        if (data === checkstyleData) {
            return new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "checkstyle error",
                    },
                    {
                        severity: "warning",
                        message: "checkstyle warning",
                    },
                    {
                        severity: "other",
                        message: "checkstyle notice",
                    },
                ],
                totals: {
                    errors: 1,
                    warnings: 1,
                    others: 1,
                },
            });
        }
    }),
};

const androidLintData = { lint: true };
const androidLintParser: Parser<object> = {
    process: jest.fn().mockImplementation((data) => {
        if (data === androidLintData) {
            return new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "android failure 1",
                    },
                    {
                        severity: "error",
                        message: "android failure 2",
                    },
                ],
                totals: {
                    errors: 2,
                    warnings: 0,
                    others: 0,
                },
            });
        }
    }),
};

jest.mock("./parsers/parsers", () => ({
    parsers: [junitParser, checkstyleParser, androidLintParser],
}));

const coreError = jest.fn();
const coreWarning = jest.fn();
const coreNotice = jest.fn();
const prFilesFilter = jest.fn();
const baseConfig = { prFilesFilter } as unknown as Config;

jest.mock("@actions/core", () => ({
    error: coreError,
    warning: coreWarning,
    notice: coreNotice,
}));

import { processFile } from "./processFile";

describe("processFile", () => {
    test.each([[""], ["aCheck"]])("for a junit file [checkName=%p]", async (checkName) => {
        const config = { ...baseConfig, checkName };
        const all = await processFile(() => junitData, config);

        expect(all).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "junit test failed",
                    },
                ],
                totals: {
                    errors: 1,
                    warnings: 0,
                    others: 0,
                },
            }),
        );

        expect(junitParser.process).toHaveBeenCalledWith(junitData, config);
        expect(checkstyleParser.process).not.toHaveBeenCalled();
        expect(androidLintParser.process).not.toHaveBeenCalled();

        expect(coreError).toHaveBeenCalledWith(
            "junit test failed",
            checkName ? undefined : { severity: "error", message: "junit test failed" },
        );
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });

    test.each([[""], ["aCheck"]])("for a checkstyle file [checkName=%p]", async (checkName) => {
        const config = { ...baseConfig, checkName };
        const all = await processFile(() => checkstyleData, config);

        expect(all).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "checkstyle error",
                    },
                    {
                        severity: "warning",
                        message: "checkstyle warning",
                    },
                    {
                        severity: "other",
                        message: "checkstyle notice",
                    },
                ],
                totals: {
                    errors: 1,
                    warnings: 1,
                    others: 1,
                },
            }),
        );

        expect(junitParser.process).toHaveBeenCalledWith(checkstyleData, config);
        expect(checkstyleParser.process).toHaveBeenCalledWith(checkstyleData, config);
        expect(androidLintParser.process).not.toHaveBeenCalled();

        expect(coreError).toHaveBeenCalledWith(
            "checkstyle error",
            checkName ? undefined : { severity: "error", message: "checkstyle error" },
        );
        expect(coreWarning).toHaveBeenCalledWith(
            "checkstyle warning",
            checkName ? undefined : { severity: "warning", message: "checkstyle warning" },
        );
        expect(coreNotice).toHaveBeenCalledWith(
            "checkstyle notice",
            checkName ? undefined : { severity: "other", message: "checkstyle notice" },
        );
    });

    test.each([[""], ["aCheck"]])("for a android lint file [checkName=%p]", async (checkName) => {
        const config = { ...baseConfig, checkName };
        const all = await processFile(() => androidLintData, config);

        expect(all).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        severity: "error",
                        message: "android failure 1",
                    },
                    {
                        severity: "error",
                        message: "android failure 2",
                    },
                ],
                totals: {
                    errors: 2,
                    warnings: 0,
                    others: 0,
                },
            }),
        );

        expect(junitParser.process).toHaveBeenCalledWith(androidLintData, config);
        expect(checkstyleParser.process).toHaveBeenCalledWith(androidLintData, config);
        expect(androidLintParser.process).toHaveBeenCalledWith(androidLintData, config);

        expect(coreError).toHaveBeenCalledWith(
            "android failure 1",
            checkName ? undefined : { severity: "error", message: "android failure 1" },
        );
        expect(coreError).toHaveBeenCalledWith(
            "android failure 2",
            checkName ? undefined : { severity: "error", message: "android failure 2" },
        );
        expect(coreWarning).not.toHaveBeenCalled();
        expect(coreNotice).not.toHaveBeenCalled();
    });
});
