import * as core from "@actions/core";
import * as glob from "@actions/glob";
import {checkName, failOnError, reports, warningsAsErrors} from "./config";
import {processFile} from "./processFile";
import {relative} from "path";
import ParsedAnnotations from "./ParsedAnnotations";
import {publishCheck} from "./publishCheck";
import {shouldFail, summaryOf} from "./utils";

export default async function main() {
    const globber = await glob.create(reports.join('\n'), { implicitDescendants: true , matchDirectories: false });
    const files = (await globber.glob()).map(it => relative(process.cwd(), it));
    core.debug(`Found ${files.length} files to process matching: ${reports.join(', ')}`);

    const currentDir = process.cwd();
    const all = new ParsedAnnotations();

    for (const file of files) {
        const relativePath = relative(currentDir, file);

        core.startGroup(`Processing \`${relativePath}\``);
        const result = await processFile(file, checkName != '');
        if (result) {
            all.add(result);
        }
        if (!result || result.annotations.length == 0) {
            core.info('No issues found');
        }
        core.endGroup();
    }

    core.notice(`Processed ${files.length} files: ${summaryOf(all)}`);

    if (checkName) {
        await publishCheck(all);
    }
    if (failOnError && shouldFail(all, warningsAsErrors)) {
        core.setFailed(`Found ${all.totals.errors} errors and ${all.totals.warnings} warnings.`);
    }
}