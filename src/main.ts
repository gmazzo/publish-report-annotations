import * as core from "@actions/core";
import * as glob from "@actions/glob";
import {reports} from "./config";
import {processFile} from "./processFile";

export default async function main() {
    const globber = await glob.create(reports.join('\n'));
    const files = await globber.glob();
    core.notice(`Found ${files.length} files to process matching: ${reports.join(', ')}`);

    const totals = {errors: 0, warnings: 0, notices: 0};

    for (const file of files) {
        core.startGroup(`Processing file \`${file}\``);
        const {errors, warnings, notices} = await processFile(file);
        core.endGroup();

        totals.errors += errors;
        totals.warnings += warnings;
        totals.notices += notices;
    }

    core.notice(`Processed ${files.length} files with:
- errors: ${totals.errors}
- warnings: ${totals.warnings}
- notices: ${totals.notices}`);
}
