import {AnnotationProperties} from "@actions/core";

export type Annotation = {
    message: string
    type: 'error' | 'warning' | 'notice'
    rawDetails?: string
} & AnnotationProperties;

export type TestCase = {
    name: string
    time?: number
    failure?: string
    skipped: boolean
};

export type TestSuite = {
    name: string
    cases: TestCase[]
    time?: number
    tests: number
    passed: number
    errors: number
    failed: number
    skipped: number
};

export type TestResult = {
    suites: TestSuite[]
    totals: {
        tests: number
        passed: number
        errors: number
        failed: number
        skipped: number
    }
};

export type CheckSuite = {
    name: string
    errors: number
    warnings: number
    others: number
};

export type ChecksResult = {
    checks: CheckSuite[]
    totals: {
        errors: number
        warnings: number
        others: number
    }
};

export class ParseResults {

    annotations: Annotation[] = [];

    tests: TestResult = {suites: [], totals: {tests: 0, passed: 0, errors: 0, failed: 0, skipped: 0}};

    checks: ChecksResult = {checks: [], totals: {errors: 0, warnings: 0, others: 0}};

    totals = {errors: 0, warnings: 0, others: 0};

    constructor(init?: Partial<ParseResults>) {
        Object.assign(this, init);
    }

    addAnnotation(annotation: Annotation, ofCheck?: CheckSuite) {
        this.annotations.push(annotation);

        switch (annotation.type) {
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
        this.tests.totals.tests += suite.tests;
        this.tests.totals.passed += suite.passed;
        this.tests.totals.errors += suite.errors;
        this.tests.totals.failed += suite.failed;
        this.tests.totals.skipped += suite.skipped;
    }

    addCheckSuite(suite: CheckSuite) {
        this.checks.checks.push(suite);
        this.checks.totals.errors += suite.errors;
        this.checks.totals.warnings += suite.warnings;
        this.checks.totals.others += suite.others;
    }

    mergeWith(results: ParseResults) {
        this.annotations.push(...results.annotations);

        this.tests.suites.push(...results.tests.suites);
        this.tests.totals.tests += results.tests.totals.tests;
        this.tests.totals.failed += results.tests.totals.failed;
        this.tests.totals.passed += results.tests.totals.passed;
        this.tests.totals.skipped += results.tests.totals.skipped;

        for (const check of results.checks.checks) {
            const existing = this.checks.checks.find(it => it.name === check.name);
            if (existing) {
                existing.errors += check.errors;
                existing.warnings += check.warnings;
                existing.others += check.others;

            } else {
                this.checks.checks.push(check);
            }
        }
        this.checks.totals.errors += results.checks.totals.errors;
        this.checks.totals.warnings += results.checks.totals.warnings;
        this.checks.totals.others += results.checks.totals.others;

        this.totals.errors += results.totals.errors;
        this.totals.warnings += results.totals.warnings;
        this.totals.others += results.totals.others;
    }

}
