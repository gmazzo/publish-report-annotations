import { jest, describe, test, expect } from "@jest/globals";
import { Config, ParseResults } from "../types";
import { readFile } from "../readFile";
import { ActivityLogData } from "./xcActivityLogParser";

const prFilesFilter = jest.fn().mockReturnValue(true);
const config = { prFilesFilter } as unknown as Config;

const { xcActivityLogParser } = await import("./xcActivityLogParser");

describe("xcActivityLogParser", () => {
    test("given json should obtain annotations", async () => {
        const data = readFile<ActivityLogData>("samples/xcactivitylog-issues.json", config)!;
        const results = await xcActivityLogParser.process(data(), config);

        expect(results).toStrictEqual(
            new ParseResults({
                annotations: [
                    {
                        endColumn: 9,
                        endLine: 37,
                        file: "App/ContentView.swift",
                        message: "Generic parameter 'Content' could not be inferred",
                        severity: "error",
                        startColumn: 9,
                        startLine: 37,
                    },
                    {
                        endColumn: 0,
                        endLine: 0,
                        message: "Skipping duplicate build file in Compile Sources build phase: App/Assets.xcassets",
                        rawDetails:
                            "note: Disabling hardened runtime with ad-hoc codesigning. (in target 'About Me' from project 'About Me')\rwarning: Skipping duplicate build file in Compile Sources build phase: App/Assets.xcassets (in target 'About Me' from project 'About Me')\rwarning: Skipping duplicate build file in Compile Sources build phase: App/Preview Content/Preview Assets.xcassets (in target 'About Me' from project 'About Me')",
                        severity: "warning",
                        startColumn: 0,
                        startLine: 0,
                    },
                    {
                        endColumn: 0,
                        endLine: 0,
                        message:
                            "Skipping duplicate build file in Compile Sources build phase: App/Preview Content/Preview Assets.xcassets",
                        rawDetails:
                            "note: Disabling hardened runtime with ad-hoc codesigning. (in target 'About Me' from project 'About Me')\rwarning: Skipping duplicate build file in Compile Sources build phase: App/Assets.xcassets (in target 'About Me' from project 'About Me')\rwarning: Skipping duplicate build file in Compile Sources build phase: App/Preview Content/Preview Assets.xcassets (in target 'About Me' from project 'About Me')",
                        severity: "warning",
                        startColumn: 0,
                        startLine: 0,
                    },
                    {
                        endColumn: 1,
                        endLine: 7,
                        file: "App/ContentView.swift",
                        message:
                            "Sendability of function types in class method 'requestTrackingAuthorization(completionHandler:)' does not match requirement in protocol 'ATTrackingManagerProtocol'; this is an error in the Swift 6 language mode",
                        rawDetails:
                            "App/ContentView.swift:7:1: warning: sendability of function types in class method 'requestTrackingAuthorization(completionHandler:)' does not match requirement in protocol 'ATTrackingManagerProtocol'; this is an error in the Swift 6 language mode\nextension ATTrackingManager: ATTrackingManagerProtocol {}\n^\nApp/ContentView.swift:7:15: note: expected sendability to match requirement here\n  static func requestTrackingAuthorization(\n              ^",
                        severity: "warning",
                        startColumn: 1,
                        startLine: 7,
                    },
                ],
                checks: {
                    checks: [
                        {
                            errors: 1,
                            issues: {
                                "Generic parameter 'Content' could not be inferred": {
                                    count: 1,
                                    severity: "error",
                                },
                                "Sendability of function types in class method 'requestTrackingAuthorization(completionHandler:)' does not match requirement in protocol 'ATTrackingManagerProtocol'; this is an error in the Swift 6 language mode":
                                    {
                                        count: 1,
                                        severity: "warning",
                                    },
                            },
                            name: "xcActivityLog",
                            others: 0,
                            warnings: 1,
                        },
                    ],
                    totals: {
                        count: 2,
                        errors: 1,
                        others: 0,
                        warnings: 1,
                    },
                },
                failures: [],
                files: [],
                ignoredAnnotations: 0,
                tests: {
                    suites: [],
                    totals: {
                        count: 0,
                        failed: 0,
                        passed: 0,
                        skipped: 0,
                    },
                },
            }),
        );
    });
});
