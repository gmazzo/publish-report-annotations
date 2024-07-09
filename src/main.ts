import * as core from "@actions/core";
import * as glob from "@actions/glob";
import {processFile} from "./processFile";
import {relative} from "path";
import {ParseResults} from "./types";
import {publishCheck} from "./publishCheck";
import {hasErrors} from "./utils";
import {summaryOf, summaryTableOf} from "./summary";
import {readConfig} from "./readConfig";

export default async function main() {
    const config = await readConfig();
    const globber = await glob.create(config.reports.join('\n'), {implicitDescendants: true, matchDirectories: false});

    const files = (await globber.glob()).map(it => relative(process.cwd(), it));
    core.debug(`Found ${files.length} files to process matching: ${config.reports.join(', ')}`);

    const currentDir = process.cwd();
    const all = new ParseResults({files});

    for (const file of files) {
        const relativePath = relative(currentDir, file);

        core.startGroup(`Processing \`${relativePath}\``);
        const result = await processFile(file, config);
        if (result) {
            all.mergeWith(result);
        }
        if (!result || result.annotations.length == 0) {
            core.info('No issues found');
        }
        core.endGroup();
    }
    all.sort();

    const checkHtmlUrl = config.checkName ? await publishCheck(all, config) : null;

    if (config.workflowSummary) {
        core.summary.addRaw(summaryTableOf(all, config));
        await core.summary.write();
    }

    if (files.length > 0) {
        core.notice(`Processed ${files.length} files: ${summaryOf(all)}` +
            (checkHtmlUrl ? `.\nSee \`${config.checkName}\` (${checkHtmlUrl})` : ''));
    } else {
        (config.failIfNoReportsFound ? core.setFailed : core.warning)(`No files found to process matching: ${config.reports.join(', ')}`);
    }

    if (config.failOnError && hasErrors(all, config)) {
        core.setFailed(`Found ${all.totals.errors} errors and ${all.totals.warnings} warnings.`);
    }

    core.setOutput('tests', all.tests.totals);
    core.setOutput('checks', all.checks.totals);
    core.setOutput('total', all.totals);
}
