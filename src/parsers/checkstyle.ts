import {ParsedAnnotation, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "./utils";
import {resolveFile} from "./resolveFile";

type CheckstyleFile = {
    _attrs: {
        name: string,
    }
    error?: {
        _attrs: {
            line: number,
            column: number,
            severity: 'error' | 'warning' | 'info' | 'ignore',
            message: string,
            source: string,
        }
    }
}

type CheckstyleData = {
    checkstyle?: {
        file: CheckstyleFile | CheckstyleFile[],
    }
}

export const checkstyleParser: Parser = {

    async parse(filepath: string) {
        const data: CheckstyleData = await readFile(filepath)

        if (data?.checkstyle) {
            const result: ParsedAnnotation[] = []

            for (const file of asArray(data.checkstyle.file)) {
                for (const error of asArray(file.error)) {
                    const type = computeType(error._attrs.severity)

                    if (type) {
                        const filePath = await resolveFile(file._attrs.name)

                        result.push({
                            type,
                            file: filePath,
                            title: error._attrs.source,
                            message: error._attrs.message,
                            startLine: error._attrs.line,
                            endLine: error._attrs.line,
                            startColumn: error._attrs.column,
                            endColumn: error._attrs.column,
                        })
                    }
                }
            }
            return result
        }
        return null;
    }

}

function computeType(severity: 'error' | 'warning' | 'info' | 'ignore') {
    switch (severity) {
        case 'error':
            return 'failure'
        case 'warning':
            return 'warning'
        case 'info':
            return 'notice'
    }
}
