import * as core from "@actions/core";
import {getAppToken} from "./githubApp";
import {Config} from "./types";
import {createFileFilter} from "./createFileFilter";

export async function readConfig(): Promise<Config> {
    const appId = core.getInput("appId");
    const githubToken = appId ?
        await getAppToken(appId,  core.getInput("appSecret", {required: true})) :
        core.getInput("token", {required: true});

    const legacySummary = parseLegacySummary();

    const filterChecks = core.getBooleanInput("filterChecks");
    const prFilesFilter = filterChecks ? await createFileFilter(githubToken) : () => true;

    return {
        githubToken,
        checkName: core.getInput("checkName"),
        reports: core.getMultilineInput("reports", {required: true}),
        testsSummary: legacySummary?.testsSummary ||
            getEnum("testsSummary", {full: null, suitesOnly: null, totals: null, off: null}),
        checksSummary: legacySummary?.checksSummary ||
            getEnum("checksSummary", {full: null, totals: null, off: null}),
        filterPassedTests: legacySummary?.filterPassedTests || core.getBooleanInput("filterPassedTests"),
        filterChecks,
        prFilesFilter,
        detectFlakyTests: core.getBooleanInput("detectFlakyTests"),
        warningsAsErrors: core.getBooleanInput("warningsAsErrors"),
        failOnError: core.getBooleanInput("failOnError"),
    };
}

function getEnum<Enum extends object>(name: string, allowedValues: Enum) {
    const input = core.getInput(name, {required: true});
    if (!Object.keys(allowedValues).includes(input)) {
        throw new Error(`Invalid value for '${name}': ${input}`);
    }
    return input as keyof Enum;
}

// TODO: remove this function in the future
function parseLegacySummary(): {
    testsSummary: 'suitesOnly' | 'totals' | 'off',
    checksSummary: 'full' | 'totals' | 'off',
    filterPassedTests?: boolean
} | undefined {
    const summary = core.getInput("summary");
    if (summary) {
        switch (summary) {
            case "detailed":
                return {testsSummary: "suitesOnly", checksSummary: "full"};

            case "detailedWithoutPassed":
                return {testsSummary: "suitesOnly", checksSummary: "full", filterPassedTests: true};

            case "totals":
                return {testsSummary: "totals", checksSummary: "totals"};

            case "off":
                return {testsSummary: "off", checksSummary: "off"};
        }
        throw new Error(`Invalid value for 'summary': ${summary}`);
    }
}
