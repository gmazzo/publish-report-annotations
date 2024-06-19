import {Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray, join} from "../utils";
import {resolveFile} from "./resolveFile";
import {CheckSuite, Config, ParseResults} from "../types";

type Severity = 'fatal' | 'error' | 'warning' | 'informational';

type Location = {
    _attributes: {
        file: string,
        line: string,
        column: string,
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
        issue: LintIssue | LintIssue[],
    }
};

export const androidLintParser: Parser = {

    parse: async function (filePath: string, config: Config) {
        const data: LintData = await readFile(filePath);

        if (data?.issues) {
            const result = new ParseResults();
            const suite: CheckSuite = {name: 'Android Lint', errors: 0, warnings: 0, others: 0, issues: {}};

            for (const testcase of asArray(data.issues.issue)) {
                const type = computeType(testcase._attributes.severity);

                if (type) {
                    for (const location of asArray(testcase.location)) {
                        const file = await resolveFile(location._attributes.file);

                        if (config.prFilesFilter(file)) {
                            const issue = `${testcase._attributes.category} / ${testcase._attributes.id}`;

                            result.addIssueToCheckSuite(suite, issue, type);
                            result.addAnnotation({
                                file,
                                severity: type,
                                title: `${testcase._attributes.category}: ${testcase._attributes.summary}`,
                                message: testcase._attributes.message,
                                rawDetails: join(testcase._attributes.explanation, testcase._attributes.errorLine1, testcase._attributes.errorLine2),
                                startLine: Number(location._attributes.line),
                                endLine: Number(location._attributes.line),
                                startColumn: Number(location._attributes.column),
                                endColumn: Number(location._attributes.column),
                            }, suite);
                        }
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
