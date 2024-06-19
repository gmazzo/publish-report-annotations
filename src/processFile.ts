import {junitParser} from "./parsers/junitParser";
import {checkstyleParser} from "./parsers/checkstyleParser";
import {androidLintParser} from "./parsers/androidLintParser";
import {join} from "./utils";
import * as core from "@actions/core";
import {Config} from "./types";

const parsers = [
    junitParser,
    checkstyleParser,
    androidLintParser,
];

export async function processFile(filepath: string, config: Config) {
    const doNotAnnotate = config.checkName != '';

    for (const parser of parsers) {
        const result = await parser.parse(filepath, config);

        if (result) {
            for (const annotation of result.annotations) {
                const message = doNotAnnotate ?
                    annotation.message :
                    annotation.rawDetails?.startsWith(annotation.message) ?
                    annotation.rawDetails :
                    join(annotation.message, annotation.rawDetails);

                switch (annotation.severity) {
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
