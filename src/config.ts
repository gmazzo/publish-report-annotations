import * as core from "@actions/core";

export const reports = core.getMultilineInput("reports", { required: true })

export const warningsAsErrors = core.getBooleanInput("warningsAsErrors")

export const failOnWarnings = core.getBooleanInput("failOnWarnings")
