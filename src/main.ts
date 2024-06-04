import * as core from "@actions/core";
import * as glob from "@actions/glob";
import config from "./config";
import {processFile} from "./processFile";
import {relative} from "path";
import {ParseResults} from "./types";
import {publishCheck} from "./publishCheck";
import {shouldFail} from "./utils";
import {summaryOf, summaryTableOf} from "./summary";
import {createFileFilter} from "./createFileFilter";

export default async function main() {
    const globber = await glob.create(config.reports.join('\n'), {implicitDescendants: true, matchDirectories: false});
    const files = (await globber.glob()).map(it => relative(process.cwd(), it));
    core.debug(`Found ${files.length} files to process matching: ${config.reports.join(', ')}`);

    const currentDir = process.cwd();
    const all = new ParseResults();

    const fileFilter = config.filterChecks ? await createFileFilter() : () => true;

    for (const file of files) {
        const relativePath = relative(currentDir, file);

        core.startGroup(`Processing \`${relativePath}\``);
        const result = await processFile(file, config.checkName != '', fileFilter);
        if (result) {
            all.mergeWith(result);
        }
        if (!result || result.annotations.length == 0) {
            core.info('No issues found');
        }
        core.endGroup();
    }

    if (files.length > 0) {
        core.notice(`Processed ${files.length} files: ${summaryOf(all)}`);
    } else {
        core.warning(`No files found to process matching: ${config.reports.join(', ')}`);
    }

    if (config.checkName) {
        await publishCheck(all);

    } else {
        core.summary.addRaw(summaryTableOf(all));
        await core.summary.write();
    }
    if (config.failOnError && shouldFail(all.totals, config.warningsAsErrors)) {
        core.setFailed(`Found ${all.totals.errors} errors and ${all.totals.warnings} warnings.`);
    }

    core.setOutput('tests', all.tests.totals);
    core.setOutput('checks', all.checks.totals);
    core.setOutput('total', all.totals);
}
