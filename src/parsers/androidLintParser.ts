import {ParsedAnnotation, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "./utils";
import {resolveFile} from "./resolveFile";

type Severity = 'fatal' | 'error' | 'warning' | 'informational';

type Issue = {
    _attrs: {
        id: string,
        severity: Severity,
        message: string,
        category: string,
        summary: string,
        explanation: string,
    }
    location: {
        _attrs: {
            file: string,
            line: number,
            column: number,
        }
    }
};

type Data = {
    issues?: {
        issue: Issue | Issue[],
    }
};

export const androidLintParser: Parser = {

    async parse(filepath: string) {
        const data: Data = await readFile(filepath);

        if (data?.issues) {
            const result: ParsedAnnotation[] = [];

            for (const testcase of asArray(data.issues.issue)) {
                const type = computeType(testcase._attrs.severity);

                if (type) {
                    const file = await resolveFile(testcase.location._attrs.file);

                    result.push({
                        file,
                        type,
                        title: `${testcase._attrs.category}: ${testcase._attrs.summary}`,
                        message: testcase._attrs.message,
                        raw_details: testcase._attrs.explanation,
                        startLine: testcase.location._attrs.line,
                        endLine: testcase.location._attrs.line,
                        startColumn: testcase.location._attrs.column,
                        endColumn: testcase.location._attrs.column,
                    });
                }
            }
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
            return 'notice';
    }
}
