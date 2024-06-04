import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {FileFilter, Parser} from "./parser";
import {ParseResults, CheckSuite} from "../types";

type Severity = 'error' | 'warning' | 'info' | 'ignore';

type CheckStyleFile = {
    _attributes: {
        name: string,
    }
    error?: {
        _attributes: {
            line: number,
            column: number,
            severity: Severity,
            message: string,
            source: string,
        }
    }
};

type CheckStyleData = {
    checkstyle?: {
        file: CheckStyleFile | CheckStyleFile[],
    }
};

export const checkstyleParser: Parser = {

    async parse(filePath: string, fileFilter: FileFilter) {
        const data: CheckStyleData = await readFile(filePath);

        if (data?.checkstyle) {
            const result = new ParseResults();
            const suite: CheckSuite = {name: 'CheckStyle', errors: 0, warnings: 0, others: 0, issues: {}};

            for (const file of asArray(data.checkstyle.file)) {
                for (const error of asArray(file.error)) {
                    const type = computeType(error._attributes.severity);

                    if (type) {
                        const filePath = await resolveFile(file._attributes.name);

                        if (fileFilter(filePath)) {
                            const source = error._attributes.source;

                            if (source) {
                                let issue = source;
                                if (source.startsWith('detekt.')) {
                                    suite.name = 'Detekt';
                                    issue = source.substring('detekt.'.length);
                                }

                                result.addIssueToCheckSuite(suite, issue, type);
                            }

                            result.addAnnotation({
                                severity: type,
                                file: filePath,
                                title: error._attributes.source,
                                message: error._attributes.message,
                                startLine: error._attributes.line,
                                endLine: error._attributes.line,
                                startColumn: error._attributes.column,
                                endColumn: error._attributes.column,
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
    switch (severity) {
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        case 'info':
            return 'other';
    }
}
