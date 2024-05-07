import * as core from "@actions/core";

export const githubToken = core.getInput("token", { required: true });

export const checkName = core.getInput("checkName");

export const reports = core.getMultilineInput("reports", { required: true });

export const warningsAsErrors = core.getBooleanInput("warningsAsErrors");

export const failOnError = core.getBooleanInput("failOnError");
