import {junitParser} from "./parsers/junitParser";
import {checkstyleParser} from "./parsers/checkstyleParser";
import {androidLintParser} from "./parsers/androidLintParser";
import {join} from "./utils";
import * as core from "@actions/core";

const parsers = [
    junitParser,
    checkstyleParser,
    androidLintParser,
];

export async function processFile(filepath: string, doNotAnnotate: boolean) {
    for (const parser of parsers) {
        const result = await parser.parse(filepath);

        if (result) {
            for (const annotation of result.annotations) {
                const message = doNotAnnotate ?
                    annotation.message :
                    annotation.rawDetails?.startsWith(annotation.message) ?
                    annotation.rawDetails :
                    join(annotation.message, annotation.rawDetails);

                switch (annotation.type) {
                    case 'error':
                        core.error(message, doNotAnnotate ? undefined : annotation);
                        break;
                    case 'warning':
                        core.warning(message, doNotAnnotate ? undefined : annotation);
                        break;
                    default:
                        core.notice(message, doNotAnnotate ? undefined : annotation);
                }
            }
            return result;
        }
    }
    return null;
}
