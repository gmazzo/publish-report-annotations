import { join, joinSeparator } from "./utils";
import * as core from "@actions/core";
import { Config, ParseResults } from "./types";
import { parsers } from "./parsers/parsers";

export async function processFile(reader: () => object, config: Config) {
    const doNotAnnotate = config.checkName != "";
    try {
        const data = reader();

        for (const parser of parsers) {
            const result = await parser.process(data as never, config);

            if (result) {
                for (const annotation of result.annotations) {
                    const baseMessage = doNotAnnotate
                        ? annotation.message
                        : annotation.rawDetails?.startsWith(annotation.message)
                          ? annotation.rawDetails
                          : join(annotation.message, annotation.rawDetails);

                    const location = joinSeparator(":", annotation.file, annotation.startLine, annotation.startColumn);

                    const message = joinSeparator(": ", location, baseMessage);

                    switch (annotation.severity) {
                        case "error":
                            core.error(message, doNotAnnotate ? undefined : annotation);
                            break;
                        case "warning":
                            core.warning(message, doNotAnnotate ? undefined : annotation);
                            break;
                        case "ignored":
                            if (config.prFilesFilterShouldNotice) {
                                core.notice(`Ignored: ${message}`, doNotAnnotate ? undefined : annotation);
                            }
                            break;
                        default:
                            core.notice(message, doNotAnnotate ? undefined : annotation);
                    }
                }

                if (result.ignoredAnnotations > 0) {
                    core.info(
                        `${result.ignoredAnnotations} annotations were suppressed by filters. Run with debug logging enabled to see details on which annotations were suppressed.`,
                    );
                }

                return result;
            }
        }
    } catch (ex) {
        switch (config.invalidFileAction) {
            case "fail":
                throw ex;
            case "report":
                return new ParseResults({ failures: [ex instanceof Error ? ex.message : `${ex}`] });
            case "log":
                core.error(ex instanceof Error ? ex : `${ex}`);
        }
    }
    return null;
}
