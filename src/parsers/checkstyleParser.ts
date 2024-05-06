import {ParsedAnnotation, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "./utils";
import {resolveFile} from "./resolveFile";

type Severity = 'error' | 'warning' | 'info' | 'ignore';

type File = {
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

type Data = {
    checkstyle?: {
        file: File | File[],
    }
};

export const checkstyleParser: Parser = {

    async parse(filepath: string) {
        const data: Data = await readFile(filepath);

        if (data?.checkstyle) {
            const result: ParsedAnnotation[] = [];

            for (const file of asArray(data.checkstyle.file)) {
                for (const error of asArray(file.error)) {
                    const type = computeType(error._attributes.severity);

                    if (type) {
                        const filePath = await resolveFile(file._attributes.name);

                        result.push({
                            type,
                            file: filePath,
                            title: error._attributes.source,
                            message: error._attributes.message,
                            startLine: error._attributes.line,
                            endLine: error._attributes.line,
                            startColumn: error._attributes.column,
                            endColumn: error._attributes.column,
                        });
                    }
                }
            }
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
            return 'notice';
    }
}
