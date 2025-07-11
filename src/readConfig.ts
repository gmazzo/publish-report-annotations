import * as core from "@actions/core";
import { getAppToken } from "./getAppToken";
import { Config } from "./types";
import { createFileFilter } from "./createFileFilter";

export async function readConfig(): Promise<Config> {
    const appId = core.getInput("appId");
    const githubToken = appId
        ? await getAppToken(appId, core.getInput("appSecret", { required: true }))
        : core.getInput("token", { required: true });

    const checkName = core.getInput("checkName");
    const hasWorkflowSummary = !!core.getInput("workflowSummary");
    const filterChecks = core.getBooleanInput("filterChecks");
    const prFilesFilter = filterChecks ? await createFileFilter(githubToken) : () => true;

    return {
        githubToken,
        checkName: checkName,
        reports: core.getMultilineInput("reports", { required: true }),
        workflowSummary: hasWorkflowSummary ? core.getBooleanInput("workflowSummary") : !checkName,
        testsSummary: getEnum("testsSummary", { full: null, suitesOnly: null, totals: null, off: null }),
        checksSummary: getEnum("checksSummary", { full: null, totals: null, off: null }),
        filterPassedTests: core.getBooleanInput("filterPassedTests"),
        filterChecks,
        prFilesFilter,
        detectFlakyTests: core.getBooleanInput("detectFlakyTests"),
        warningsAsErrors: core.getBooleanInput("warningsAsErrors"),
        failOnError: core.getBooleanInput("failOnError"),
        failIfNoReportsFound: core.getBooleanInput("failIfNoReportsFound"),
    };
}

function getEnum<Enum extends object>(name: string, allowedValues: Enum) {
    const input = core.getInput(name, { required: true });
    if (!Object.keys(allowedValues).includes(input)) {
        throw new Error(
            `Invalid value for '${name}': '${input}', possible values are: ${Object.keys(allowedValues)
                .map((it) => `'${it}'`)
                .join(", ")}`,
        );
    }
    return input as keyof Enum;
}
