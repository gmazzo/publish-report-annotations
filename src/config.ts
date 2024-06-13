import * as core from "@actions/core";

export interface Config {
    githubToken: string;
    checkName: string;
    reports: string[];
    summary: "detailed" | "detailedWithoutPassed" | "totals" | "off";
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
                summary: (() => {
                    const value = core.getInput("summary", {required: true});

                    switch (value) {
                        case "detailed":
                        case "detailedWithoutPassed":
                        case "totals":
                        case "off":
                            return value;
                    }
                    throw new Error(`Invalid summary value: ${value}`);
                })(),
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

export function createConfig(values: Partial<Config> = {}): Config {
    return values as Config;
}
