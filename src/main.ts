import * as core from "@actions/core";
import * as glob from "@actions/glob";
import {failOnError, reports, warningsAsErrors} from "./config";
import {processFile} from "./processFile";
import {relative} from "path";

export default async function main() {
    const globber = await glob.create(reports.join('\n'), { implicitDescendants: true , matchDirectories: false });
    const files = (await globber.glob()).map(it => relative(process.cwd(), it));
    core.debug(`Found ${files.length} files to process matching: ${reports.join(', ')}`);

    const currentDir = process.cwd();
    const totals = {errors: 0, warnings: 0, notices: 0};

    for (const file of files) {
        const relativePath = relative(currentDir, file);

        core.startGroup(`Processing \`${relativePath}\``);
        const {errors, warnings, notices} = await processFile(file);
        if (errors == 0 && warnings == 0 && notices == 0) {
            core.notice('No issues found');
        }
        core.endGroup();

        totals.errors += errors;
        totals.warnings += warnings;
        totals.notices += notices;
    }

    core.info(`Processed ${files.length} files: ${totals.errors} error(s), ${totals.warnings} warning(s) and ${totals.notices} notice(s)`);

    if (failOnError && (totals.errors > 0 || (totals.warnings > 0 && warningsAsErrors))) {
        core.setFailed(`Found ${totals.errors} errors and ${totals.warnings} warnings.`);
    }
}
