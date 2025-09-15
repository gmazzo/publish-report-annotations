import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { processFile } from "./processFile";
import { relative } from "path";
import { ParseResults } from "./types";
import { publishCheck } from "./publishCheck";
import { hasErrors } from "./utils";
import { summaryOf, summaryTableOf } from "./summary";
import { readConfig } from "./readConfig";
import { readFile } from "./readFile";

export default async function main() {
    const config = await readConfig();
    const globber = await glob.create(config.reports.join("\n"), { implicitDescendants: true, matchDirectories: true });

    const files = (await globber.glob()).map((it) => relative(process.cwd(), it));
    core.debug(`Found ${files.length} files to process matching: ${config.reports.join(", ")}`);

    const currentDir = process.cwd();
    const all = new ParseResults({ files });
    let check: { id: number; url: string } | undefined;

    for (const [i, file] of files.entries()) {
        const reader = readFile<object>(file, config);
        if (!reader) continue;

        const relativePath = relative(currentDir, file);

        core.startGroup(`Processing \`${relativePath}\``);
        const result = await processFile(reader, config);
        if (result) {
            all.mergeWith(result);
        }
        if (!result || result.annotations.length == 0) {
            core.info("No issues found");
        }
        core.endGroup();

        if (config.checkName && i < files.length - 1) {
            check = await publishCheck(all, config, true, check?.id);
            all.annotations = []; // Clear annotations after publishing to avoid consuming the heap
        }
    }
    if (config.checkName) {
        check = await publishCheck(all, config, false, check?.id);
    }
    all.annotations = []; // Clear annotations after publishing to avoid consuming the heap

    if (config.workflowSummary) {
        core.summary.addRaw(summaryTableOf(all, config));
        await core.summary.write();
    }

    if (files.length > 0) {
        core.notice(
            `Processed ${files.length} files: ${summaryOf(all)}` +
                (check?.url ? `.\nSee \`${config.checkName}\` (${check?.url})` : ""),
        );
    } else {
        (config.failIfNoReportsFound ? core.setFailed : core.warning)(
            `No files found to process matching: ${config.reports.join(", ")}`,
        );
    }

    if (config.failOnError && hasErrors(all, config)) {
        core.setFailed(
            `Found ${all.tests.totals.failed + all.checks.totals.errors} errors and ${all.checks.totals.warnings} warnings.`,
        );
    }

    core.setOutput("tests", all.tests.totals);
    core.setOutput("checks", all.checks.totals);
}
