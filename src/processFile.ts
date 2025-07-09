import {join} from "./utils";
import * as core from "@actions/core";
import {Config} from "./types";
import {parsers} from "./parsers/parsers";

export async function processFile(reader: () => object, config: Config) {
    const doNotAnnotate = config.checkName != '';
    const data = reader();

    for (const parser of parsers) {
        const result = await parser.process(data as never, config);

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
