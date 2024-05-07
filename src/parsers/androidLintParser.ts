import {Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import ParsedAnnotations from "../ParsedAnnotations";

type Severity = 'fatal' | 'error' | 'warning' | 'informational';

type Issue = {
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

type Data = {
    issues?: {
        issue: Issue | Issue[],
    }
};

export const androidLintParser: Parser = {

    async parse(filepath: string) {
        const data: Data = await readFile(filepath);

        if (data?.issues) {
            const result = new ParsedAnnotations();

            for (const testcase of asArray(data.issues.issue)) {
                const type = computeType(testcase._attributes.severity);

                if (type) {
                    const file = await resolveFile(testcase.location._attributes.file);

                    result.add({
                        file,
                        type,
                        title: `${testcase._attributes.category}: ${testcase._attributes.summary}`,
                        message: testcase._attributes.message,
                        rawDetails: testcase._attributes.explanation,
                        startLine: testcase.location._attributes.line,
                        endLine: testcase.location._attributes.line,
                        startColumn: testcase.location._attributes.column,
                        endColumn: testcase.location._attributes.column,
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
