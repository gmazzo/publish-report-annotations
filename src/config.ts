import * as core from "@actions/core";

export interface Config {
    githubToken: string;
    checkName: string;
    reports: string[];
    testsSummary: 'full' | 'suitesOnly' | 'totals' | 'off';
    checksSummary: 'full' | 'totals' | 'off';
    filterPassedTests: boolean;
    filterChecks: boolean;
    detectFlakyTests: boolean;
    warningsAsErrors: boolean;
    failOnError: boolean;
}

export class ConfigImpl implements Config {
    private values?: Config;

    resolve() {
        if (!this.values) {
            const legacySummary = parseLegacySummary();

            this.values = {
                githubToken: core.getInput("token", {required: true}),
                checkName: core.getInput("checkName"),
                reports: core.getMultilineInput("reports", {required: true}),
                testsSummary: legacySummary?.testsSummary || getEnum("testsSummary", {full: null, suitesOnly: null, totals: null, off: null}),
                checksSummary: legacySummary?.checksSummary || getEnum("checksSummary", {full: null, totals: null, off: null}),
                filterPassedTests: legacySummary?.filterPassedTests || core.getBooleanInput("filterPassedTests"),
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

    get testsSummary() {
        return this.resolve().testsSummary;
    }

    get checksSummary() {
        return this.resolve().checksSummary;
    }

    get filterPassedTests() {
        return this.resolve().filterPassedTests;
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

function getEnum<Enum extends object>(name: string, allowedValues: Enum) {
    const input = core.getInput(name, {required: true});
    if (!Object.keys(allowedValues).includes(input)) {
        throw new Error(`Invalid value for '${name}': ${input}`);
    }
    return input as keyof Enum;
}

// TODO: remove this function in the future
function parseLegacySummary(): { testsSummary: 'suitesOnly' | 'totals' | 'off', checksSummary: 'full' | 'totals' | 'off', filterPassedTests?: boolean } | undefined {
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
