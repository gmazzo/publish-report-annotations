import * as core from "@actions/core";

export type SummaryMode = {
    tests: { suites: boolean, cases: boolean, skipPassed: boolean };
    checks: boolean;
};

export interface Config {
    githubToken: string;
    checkName: string;
    reports: string[];
    summary: SummaryMode | false;
    filterChecks: boolean;
    detectFlakyTests: boolean;
    warningsAsErrors: boolean;
    failOnError: boolean;
}

export class ConfigImpl implements Config {
    private values?: Config;

    resolve() {
        if (!this.values) {
            this.values = {
                githubToken: core.getInput("token", {required: true}),
                checkName: core.getInput("checkName"),
                reports: core.getMultilineInput("reports", {required: true}),
                summary: parseSummary(core.getInput("summary", {required: true})),
                filterChecks: core.getBooleanInput("filterChecks"),
                detectFlakyTests: core.getBooleanInput("detectFlakyTests"),
                warningsAsErrors: core.getBooleanInput("warningsAsErrors"),
                failOnError: core.getBooleanInput("failOnError"),
            };
        }
        return this.values;
    }

    get githubToken(): string {
        return this.resolve().githubToken;
    }

    get checkName() {
        return this.resolve().checkName;
    }

    get reports() {
        return this.resolve().reports;
    }

    get summary() {
        return this.resolve().summary;
    }

    get filterChecks() {
        return this.resolve().filterChecks;
    }

    get detectFlakyTests() {
        return this.resolve().detectFlakyTests;
    }

    get warningsAsErrors() {
        return this.resolve().warningsAsErrors;
    }

    get failOnError() {
        return this.resolve().failOnError;
    }
}

export default new ConfigImpl() as Config;

function parseSummary(input: string): Config['summary'] {
    const value = {tests: {suites: false, cases: false, skipPassed: false}, checks: false};

    function printLegacyWarning() {
        core.warning(`The summary flag '${input}' is deprecated and will be removed in a future version. Please use 'testSuites', 'testCases', 'skipPassed', 'checks' or 'off' instead.`);
    }

    // process legacy values
    switch (input) {
        case "detailed":
            printLegacyWarning();
            value.tests.suites = true;
            value.checks = true;
            return value;

        case "detailedWithoutPassed":
            printLegacyWarning();
            value.tests.suites = true;
            value.tests.skipPassed = true;
            value.checks = true;
            return value;

        case "totals":
            printLegacyWarning();
            value.checks = true;
            return value;
    }

    const flags = input.split(/[\s+,|]/);
    for (const flag of flags) {
        switch (flag) {
            case "testSuites":
                value.tests.suites = true;
                break;

            case "testCases":
                value.tests.cases = true;
                break;

            case "skipPassed":
                value.tests.skipPassed = true;
                break;

            case "checks":
                value.checks = true;
                break;

            case "off":
                if (flags.length > 1) {
                    throw new Error(`Invalid summary flag: 'off' can not be combined with other values`);
                }
                return false;

            default:
                throw new Error(`Invalid summary flag: '${flag}'`);
        }
    }
    if (value.tests.skipPassed && !(value.tests.suites || value.tests.cases)) {
        throw new Error(`Invalid summary flag: 'skipPassed' can only be used with 'testSuites' or 'testCases'`);
    }
    return value;
}
