import { Parser } from "./parser";
import { asArray, join } from "../utils";
import { resolveFile } from "./resolveFile";
import { CheckSuite, Config, ParseResults } from "../types";

type Severity = "fatal" | "error" | "warning" | "informational";

type Location = {
    _attributes: {
        file: string;
        line: string;
        column: string;
    };
};

type LintIssue = {
    _attributes: {
        id: string;
        severity: Severity;
        message: string;
        category: string;
        summary: string;
        explanation: string;
        errorLine1?: string;
        errorLine2?: string;
    };
    location: Location | Location[];
};

export type LintData = {
    issues?: {
        _attributes: {
            by: string;
        };
        issue: LintIssue | LintIssue[];
    };
};

export const androidLintParser: Parser<LintData> = {
    process: async function (data: LintData, config: Config) {
        if (data?.issues) {
            const result = new ParseResults();
            const suite: CheckSuite = {
                name: data.issues._attributes.by || "Android Lint",
                errors: 0,
                warnings: 0,
                others: 0,
                issues: {},
            };

            for (const issue of asArray(data.issues.issue)) {
                const type = computeType(issue._attributes.severity);

                if (type) {
                    for (const location of asArray(issue.location)) {
                        const file = await resolveFile(location._attributes.file);

                        if (config.prFilesFilter(file)) {
                            const issueSummary = `${issue._attributes.category} / ${issue._attributes.id}`;

                            result.addIssueToCheckSuite(suite, issueSummary, type);
                            result.addAnnotation({
                                file,
                                severity: type,
                                title: `${issue._attributes.category}: ${issue._attributes.summary}`,
                                message: issue._attributes.message,
                                rawDetails: join(
                                    issue._attributes.explanation,
                                    issue._attributes.errorLine1,
                                    issue._attributes.errorLine2,
                                ),
                                startLine: Number(location._attributes.line),
                                endLine: Number(location._attributes.line),
                                startColumn: Number(location._attributes.column),
                                endColumn: Number(location._attributes.column),
                            });
                        }
                    }
                }
            }

            result.addCheckSuite(suite);
            return result;
        }
        return null;
    },
};

function computeType(severity: Severity) {
    switch (severity.toLowerCase()) {
        case "error":
            return "error";
        case "warning":
            return "warning";
        case "informational":
            return "other";
    }
}
