import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { processFile } from "./processFile";
import { relative } from "path";
import { ParseResults } from "./types";
import { MAX_ANNOTATIONS_PER_API_CALL, publishCheck } from "./publishCheck";
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
    let check: { id: number; html_url: string | null } | undefined;

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

        if (config.checkName && i < files.length - 1 && all.annotations.length >= MAX_ANNOTATIONS_PER_API_CALL) {
            // to optimize API call, we provide an exact multiple of MAX_ANNOTATIONS_PER_API_CALL
            // remaining ones will be published by the last call
            const limit = all.annotations.length - (all.annotations.length % MAX_ANNOTATIONS_PER_API_CALL);
            const adjusted = all.annotations.slice(0, limit);
            const remaining = all.annotations.slice(limit, all.annotations.length);

            all.annotations = adjusted;
            check = await publishCheck(all, config, true, check?.id);
            all.annotations = remaining;
        }
    }
    if (config.checkName) {
        check = await publishCheck(all, config, false, check?.id).catch((error) => {
            core.error(error);
            return undefined;
        });
    }
    all.annotations = []; // Clear annotations after publishing to avoid consuming the heap

    if (config.workflowSummary) {
        core.summary.addRaw(summaryTableOf(all, config));
        await core.summary.write();
    }

    if (files.length > 0) {
        core.notice(
            `Processed ${files.length} files: ${summaryOf(all)}` +
                (check?.html_url ? `.\nSee \`${config.checkName}\` (${check?.html_url})` : ""),
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
