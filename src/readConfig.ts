import * as core from "@actions/core";
import bytes from "bytes";
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
        reportFileMaxSize: getBytes("reportFileMaxSize"),
        invalidFileAction: getEnum("invalidFileAction", {
            fail: null,
            error: null,
            warning: null,
            other: null,
            ignore: null,
        }),
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

function getBytes(name: string): number {
    const input = core.getInput(name, { required: true });
    const value = bytes(input);
    if (value === null || isNaN(value) || value < 0) {
        throw new Error(`Invalid value for '${name}': '${input}', please provide a valid byte size, e.g. '100MB'`);
    }
    return value;
}
