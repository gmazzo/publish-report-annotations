import {AnnotationProperties} from "@actions/core";

type Severity = 'error' | 'warning' | 'other';

export type Annotation = {
    message: string
    severity: 'error' | 'warning' | 'other'
    rawDetails?: string
} & AnnotationProperties;

export type TestSuite = {
    name: string
    took?: number
    count: number
    passed: number
    errors: number
    failed: number
    skipped: number
    retries?: number,
};

export type TestResult = {
    suites: TestSuite[]
    totals: {
        count: number
        passed: number
        errors: number
        failed: number
        skipped: number
        retries?: number,
    }
};

export type CheckSuite = {
    name: string
    errors: number
    warnings: number
    others: number
    issues: {[key: string]: {severity: Severity, count: number}}
};

export type ChecksResult = {
    checks: CheckSuite[]
    totals: {
        count: number,
        errors: number
        warnings: number
        others: number
    }
};

export class ParseResults {

    annotations: Annotation[] = [];

    tests: TestResult = {suites: [], totals: {count: 0, passed: 0, errors: 0, failed: 0, skipped: 0}};

    checks: ChecksResult = {checks: [], totals: {count: 0, errors: 0, warnings: 0, others: 0}};

    totals = {errors: 0, warnings: 0, others: 0};

    constructor(init?: Partial<ParseResults>) {
        Object.assign(this, init);
    }

    addAnnotation(annotation: Annotation, ofCheck?: CheckSuite) {
        this.annotations.push(annotation);

        switch (annotation.severity) {
            case 'error':
                if (ofCheck) ofCheck.errors++;
                this.totals.errors++;
                break;
            case 'warning':
                if (ofCheck) ofCheck.warnings++;
                this.totals.warnings++;
                break;
            default:
                if (ofCheck) ofCheck.others++;
                this.totals.others++;
        }
    }

    addTestSuite(suite: TestSuite) {
        this.tests.suites.push(suite);
        this.tests.totals.count += suite.count;
        this.tests.totals.passed += suite.passed;
        this.tests.totals.errors += suite.errors;
        this.tests.totals.failed += suite.failed;
        this.tests.totals.skipped += suite.skipped;
        if (suite.retries !== undefined) {
            this.tests.totals.retries = (this.tests.totals.retries || 0) + suite.retries;
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
            suite.issues[issue] = {severity: severity, count: 1};
        }
    }

    mergeWith(results: ParseResults) {
        this.annotations.push(...results.annotations);

        this.tests.suites.push(...results.tests.suites);
        this.tests.totals.count += results.tests.totals.count;
        this.tests.totals.failed += results.tests.totals.failed;
        this.tests.totals.passed += results.tests.totals.passed;
        this.tests.totals.skipped += results.tests.totals.skipped;

        if (results.tests.totals.retries) {
            this.tests.totals.retries = (this.tests.totals.retries || 0) + results.tests.totals.retries;
        }

        for (const check of results.checks.checks) {
            const existingCheck = this.checks.checks.find(it => it.name === check.name);
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

        this.totals.errors += results.totals.errors;
        this.totals.warnings += results.totals.warnings;
        this.totals.others += results.totals.others;
    }

}
