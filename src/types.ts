import { AnnotationProperties } from "@actions/core";
import { FileFilter } from "./parsers/parser";

export interface Config {
    githubToken: string;
    checkName: string;
    reports: string[];
    workflowSummary: boolean;
    testsSummary: "full" | "suitesOnly" | "totals" | "off";
    checksSummary: "full" | "totals" | "off";
    filterPassedTests: boolean;
    filterChecks: boolean;
    prFilesFilter: FileFilter;
    detectFlakyTests: boolean;
    warningsAsErrors: boolean;
    failOnError: boolean;
    failIfNoReportsFound: boolean;
    reportFileMaxSize: number;
    invalidFileAction: "fail" | Severity | "ignore";
}

type Severity = "error" | "warning" | "other";

export type Annotation = {
    message: string;
    severity: "error" | "warning" | "other";
    rawDetails?: string;
} & AnnotationProperties;

export type TestCase = {
    name: string;
    className: string;
    took?: string;
    outcome: "passed" | "failed" | "skipped" | "flaky";
    retries?: number;
};

export type TestSuite = {
    name: string;
    took?: string;
    passed: number;
    failed: number;
    skipped: number;
    flaky?: number;
    cases: TestCase[];
};

export type TestResult = {
    suites: TestSuite[];
    totals: {
        count: number;
        passed: number;
        failed: number;
        skipped: number;
        flaky?: number;
    };
};

export type CheckSuite = {
    name: string;
    errors: number;
    warnings: number;
    others: number;
    issues: { [key: string]: { severity: Severity; count: number } };
};

export type ChecksResult = {
    checks: CheckSuite[];
    totals: {
        count: number;
        errors: number;
        warnings: number;
        others: number;
    };
};

export type AggregatedResults = {
    hasFiles: boolean;
    tests: TestResult;
    checks: ChecksResult;
};

export class ParseResults {
    files: string[] = [];

    annotations: Annotation[] = [];

    tests: TestResult = { suites: [], totals: { count: 0, passed: 0, failed: 0, skipped: 0 } };

    checks: ChecksResult = { checks: [], totals: { count: 0, errors: 0, warnings: 0, others: 0 } };

    constructor(init?: Partial<ParseResults>) {
        Object.assign(this, init);
    }

    get hasFiles() {
        return this.files.length > 0;
    }

    addAnnotation(annotation: Annotation) {
        this.annotations.push(annotation);
    }

    addTestSuite(suite: TestSuite) {
        this.tests.suites.push(suite);
        this.tests.totals.count += suite.cases.length;
        this.tests.totals.passed += suite.passed;
        this.tests.totals.failed += suite.failed;
        this.tests.totals.skipped += suite.skipped;
        if (suite.flaky !== undefined) {
            this.tests.totals.flaky = (this.tests.totals.flaky || 0) + suite.flaky;
        }
    }

    addCheckSuite(suite: CheckSuite) {
        if (suite.errors > 0 || suite.warnings > 0 || suite.others > 0) {
            this.checks.checks.push(suite);
            this.checks.totals.count += suite.errors + suite.warnings + suite.others;
            this.checks.totals.errors += suite.errors;
            this.checks.totals.warnings += suite.warnings;
            this.checks.totals.others += suite.others;
        }
    }

    addIssueToCheckSuite(this: void, suite: CheckSuite, issue: string, severity: Severity) {
        const current = suite.issues[issue];
        if (current) {
            current.count++;
        } else {
            suite.issues[issue] = { severity: severity, count: 1 };
        }
        switch (severity) {
            case "error":
                suite.errors++;
                break;
            case "warning":
                suite.warnings++;
                break;
            default:
                suite.others++;
        }
    }

    mergeWith(results: ParseResults) {
        this.annotations.push(...results.annotations);

        this.tests.suites.push(...results.tests.suites);
        this.tests.totals.count += results.tests.totals.count;
        this.tests.totals.failed += results.tests.totals.failed;
        this.tests.totals.passed += results.tests.totals.passed;
        this.tests.totals.skipped += results.tests.totals.skipped;
        if (results.tests.totals.flaky !== undefined) {
            this.tests.totals.flaky = (this.tests.totals.flaky || 0) + results.tests.totals.flaky;
        }

        for (const check of results.checks.checks) {
            const existingCheck = this.checks.checks.find((it) => it.name === check.name);
            if (existingCheck) {
                for (const issue in check.issues) {
                    const existingIssue = existingCheck.issues[issue];
                    if (existingIssue) {
                        existingIssue.count += check.issues[issue].count;
                    } else {
                        existingCheck.issues[issue] = check.issues[issue];
                    }
                }
                existingCheck.errors += check.errors;
                existingCheck.warnings += check.warnings;
                existingCheck.others += check.others;
            } else {
                this.checks.checks.push(check);
            }
        }
        this.checks.totals.count += results.checks.totals.count;
        this.checks.totals.errors += results.checks.totals.errors;
        this.checks.totals.warnings += results.checks.totals.warnings;
        this.checks.totals.others += results.checks.totals.others;
    }

    sort() {
        this.tests.suites.sort((a, b) => a.name.localeCompare(b.name));
        this.checks.checks.sort((a, b) => a.name.localeCompare(b.name));
    }
}
