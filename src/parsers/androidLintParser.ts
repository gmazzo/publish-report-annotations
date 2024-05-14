import {FileFilter, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {CheckSuite, ParseResults} from "../types";

type Severity = 'fatal' | 'error' | 'warning' | 'informational';

type LintIssue = {
    _attributes: {
        id: string,
        severity: Severity,
        message: string,
        category: string,
        summary: string,
        explanation: string,
    }
    location: {
        _attributes: {
            file: string,
            line: number,
            column: number,
        }
    }
};

type LintData = {
    issues?: {
        issue: LintIssue | LintIssue[],
    }
};

export const androidLintParser: Parser = {

    parse: async function (filePath: string, fileFilter: FileFilter) {
        const data: LintData = await readFile(filePath);

        if (data?.issues) {
            const result = new ParseResults();
            const suite: CheckSuite = {name: 'Android Lint', errors: 0, warnings: 0, others: 0, issues: {}};

            for (const testcase of asArray(data.issues.issue)) {
                const type = computeType(testcase._attributes.severity);

                if (type) {
                    const file = await resolveFile(testcase.location._attributes.file);

                    if (fileFilter(file)) {
                        const issue = `${testcase._attributes.category} / ${testcase._attributes.id}`;

                        result.addIssueToCheckSuite(suite, issue, type);
                        result.addAnnotation({
                            file,
                            severity: type,
                            title: `${testcase._attributes.category}: ${testcase._attributes.summary}`,
                            message: testcase._attributes.message,
                            rawDetails: testcase._attributes.explanation,
                            startLine: testcase.location._attributes.line,
                            endLine: testcase.location._attributes.line,
                            startColumn: testcase.location._attributes.column,
                            endColumn: testcase.location._attributes.column,
                        }, suite);
                    }
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
