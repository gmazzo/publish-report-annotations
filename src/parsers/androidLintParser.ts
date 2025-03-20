import {Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray, join} from "../utils";
import {resolveFile} from "./resolveFile";
import {Annotation, CheckSuite, Config, ParseResults} from "../types";

type Severity = 'fatal' | 'error' | 'warning' | 'informational';

type Location = {
    _attributes: {
        file: string,
        line: string,
        column?: string,
    }
};

type LintIssue = {
    _attributes: {
        id: string,
        severity: Severity,
        message: string,
        category: string,
        summary: string,
        explanation: string,
        errorLine1?: string,
        errorLine2?: string,
    }
    location: Location | Location[],
};

type LintData = {
    issues?: {
        _attributes: {
            by: string,
        }
        issue: LintIssue | LintIssue[],
    }
};

export const androidLintParser: Parser = {

    parse: async function (filePath: string, config: Config) {
        const data: LintData = await readFile(filePath);

        if (data?.issues) {
            const result = new ParseResults();
            const suite: CheckSuite = {
                name: data.issues._attributes.by || 'Android Lint',
                errors: 0,
                warnings: 0,
                others: 0,
                issues: {}
            };

            for (const issue of asArray(data.issues.issue)) {
                const type = computeType(issue._attributes.severity)
                if (!type) continue

                const locations = asArray(issue.location)

                if (locations.length > 0) {
                    for (const location of locations) {
                        await reportIssue(config, issue, suite, result, type, location)
                    }

                } else {
                    await reportIssue(config, issue, suite, result, type, {
                        _attributes: {
                            file: filePath,
                            line: '1',
                        }
                    })
                }
            }

            result.addCheckSuite(suite);
            return result;
        }
        return null;
    }

};

function computeType(severity: Severity) {
    switch (severity.toLowerCase()) {
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        case 'informational':
            return 'other';
    }
}

async function reportIssue(
    config: Config,
    issue: LintIssue,
    suite: CheckSuite,
    result: ParseResults,
    type: Annotation['severity'],
    location: Location,
) {
    const file = await resolveFile(location._attributes.file);

    if (config.prFilesFilter(file)) {
        const issueMessage = `${issue._attributes.category} / ${issue._attributes.id}`

        result.addIssueToCheckSuite(suite, issueMessage, type);
        result.addAnnotation({
            file,
            severity: type,
            title: `${issue._attributes.category}: ${issue._attributes.summary}`,
            message: issue._attributes.message,
            rawDetails: join(issue._attributes.explanation, issue._attributes.errorLine1, issue._attributes.errorLine2),
            startLine: Number(location._attributes.line),
            endLine: Number(location._attributes.line),
            startColumn: Number(location._attributes.column) || undefined,
            endColumn: Number(location._attributes.column) || undefined,
        }, suite);
    }
}
