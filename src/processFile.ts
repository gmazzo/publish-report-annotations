import * as core from "@actions/core";
import {junitParser} from "./parsers/junit";

const parsers = [
    junitParser
]

export async function processFile(filepath: string) {
    const totals = {errors: 0, warnings: 0, notices: 0}

    for (const parser of parsers) {
        const annotations = await parser.parse(filepath)

        if (annotations) {
            for (const annotation of annotations) {

                switch (annotation.type) {
                    case 'failure':
                        core.error(annotation.message, annotation)
                        totals.errors++
                        break
                    case 'warning':
                        core.warning(annotation.message, annotation)
                        totals.warnings++
                        break
                    default:
                        core.notice(annotation.message, annotation)
                        totals.notices++
                }
            }
        }
    }
    return totals
}
