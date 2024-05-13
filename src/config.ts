import * as core from "@actions/core";

export const githubToken = core.getInput("token", {required: true});

export const checkName = core.getInput("checkName");

export const reports = core.getMultilineInput("reports", {required: true});

export const summary = (() => {
    const value = core.getInput("summary", {required: true});

    switch (value) {
        case "detailed":
        case "totals":
        case "off":
            return value;
    }
    throw new Error(`Invalid summary value: ${value}`);
})();

export const warningsAsErrors = core.getBooleanInput("warningsAsErrors");

export const failOnError = core.getBooleanInput("failOnError");
