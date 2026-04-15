import { Parser } from "./parser";
import { resolveFile } from "./resolveFile";
import { CheckSuite, Config, ParseResults, Severity } from "../types";

type ActivityLog = {
    documentURL?: string;
    type: string;
    title: string;
    detail?: string;
    severity: number;
    startingLineNumber?: number;
    endingLineNumber?: number;
    startingColumnNumber?: number;
    endingColumnNumber?: number;
    characterRangeStart?: number;
    characterRangeEnd?: number;
};

export type ActivityLogData = {
    errors?: ActivityLog[];
    warnings?: ActivityLog[];
    notes?: ActivityLog[];
};

export const xcActivityLogParser: Parser<ActivityLogData> = {
    process: async function (data: ActivityLogData, config: Config) {
        if (!data.errors && !data.warnings && !data.notes) {
            return null;
        }

        const result = new ParseResults();
        const suite: CheckSuite = {
            name: "xcActivityLog",
            errors: 0,
            warnings: 0,
            others: 0,
            issues: {},
        };

        async function processEntries(entries: ActivityLog[] | undefined, severity: Severity) {
            if (!entries) return;

            for (const entry of entries) {
                const filePath = entry.documentURL?.replace(/^file:\/\//, "");
                const file = filePath ? await resolveFile(filePath) : undefined;
                const included = file && config.prFilesFilter(file);

                if (included) {
                    result.addIssueToCheckSuite(suite, entry.title, severity);
                }

                result.addAnnotation(
                    {
                        ...(file ? { file } : {}),
                        severity: !file || included ? severity : "ignored",
                        message: entry.title,
                        ...(entry.detail ? { rawDetails: entry.detail } : {}),
                        startLine: entry.startingLineNumber,
                        endLine: entry.endingLineNumber,
                        startColumn: entry.startingColumnNumber,
                        endColumn: entry.endingColumnNumber,
                    },
                    config,
                );
            }
        }
        await processEntries(data.errors, "error");
        await processEntries(data.warnings, "warning");
        await processEntries(data.notes, "other");

        result.addCheckSuite(suite);
        return result;
    },
};
