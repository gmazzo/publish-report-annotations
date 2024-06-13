import {ParseResults} from "./types";

const junitResult1 = (() => {
    const result = new ParseResults();
    result.addAnnotation({severity: "error", message: "junit failure 1"});
    result.addAnnotation({severity: "warning", message: "junit failure 2"});
    result.addTestSuite({name: "test1", count: 2, passed: 0, failed: 0, skipped: 0});
    result.addTestSuite({name: "test2", count: 6, passed: 3, failed: 1, skipped: 1});
    return result;
})();

const junitResult2 = (() => {
    const result = new ParseResults();
    result.addAnnotation({severity: "other", message: "junit skip 1"});
    result.addAnnotation({severity: "other", message: "junit skip 2"});
    result.addTestSuite({
        name: "test3",
        count: 2,
        passed: 0,
        failed: 0,
        skipped: 2
    });
    result.addTestSuite({
        name: "test4",
        count: 3,
        passed: 0,
        failed: 0,
        skipped: 3,
        flaky: 1,
    });
    return result;
})();

const androidLintResult1 = (() => {
    const result = new ParseResults();
    const suite = {name: "Android Lint", errors: 0, warnings: 0, others: 0, issues: {}};

    result.addAnnotation({severity: "error", message: "android failure 1"}, suite);
    result.addAnnotation({severity: "error", message: "android failure 2"}, suite);
    result.addAnnotation({severity: "error", message: "android failure 3"}, suite);
    result.addAnnotation({severity: "warning", message: "android warning 1"}, suite);
    result.addIssueToCheckSuite(suite, "category1 / id1", "error");
    result.addIssueToCheckSuite(suite, "category2 / id2", "error");
    result.addIssueToCheckSuite(suite, "category2 / id3", "warning");
    result.addCheckSuite(suite);
    return result;
})();

const androidLintResult2 = (() => {
    const result = new ParseResults();
    const suite = {name: "Android Lint", errors: 0, warnings: 0, others: 0, issues: {}};

    result.addAnnotation({severity: "warning", message: "lint warning 1"}, suite);
    result.addAnnotation({severity: "warning", message: "lint warning 2"}, suite);
    result.addAnnotation({severity: "warning", message: "lint warning 3"}, suite);
    result.addAnnotation({severity: "other", message: "lint other 2"}, suite);
    result.addIssueToCheckSuite(suite, "category1 / id1", "warning");
    result.addIssueToCheckSuite(suite, "category2 / id3", "warning");
    result.addIssueToCheckSuite(suite, "category2 / id3", "warning");
    result.addIssueToCheckSuite(suite, "category2 / id3", "warning");
    result.addIssueToCheckSuite(suite, "category2 / id4", "other");
    result.addCheckSuite(suite);
    return result;
})();

const checkStyleResult = (() => {
    const result = new ParseResults();
    const suite = {name: "Checkstyle", errors: 0, warnings: 0, others: 0, issues: {}};

    result.addAnnotation({severity: "error", message: "checkstyle error"}, suite);
    result.addAnnotation({severity: "warning", message: "checkstyle warning"}, suite);
    result.addAnnotation({severity: "other", message: "checkstyle notice"}, suite);
    result.addIssueToCheckSuite(suite, "issue1", "error");
    result.addIssueToCheckSuite(suite, "issue2", "warning");
    result.addIssueToCheckSuite(suite, "issue3", "other");
    result.addIssueToCheckSuite(suite, "issue3", "other");
    result.addIssueToCheckSuite(suite, "issue3", "other");
    result.addCheckSuite(suite);
    return result;
})();

describe("ParseResults", () => {
    it("mergeWith combine results correctly", () => {
        const all = new ParseResults();

        all.mergeWith(junitResult1);
        all.mergeWith(junitResult2);
        all.mergeWith(androidLintResult1);
        all.mergeWith(androidLintResult2);
        all.mergeWith(checkStyleResult);

        expect(all).toStrictEqual(new ParseResults({
            annotations: [
                {message: "junit failure 1", severity: "error"},
                {message: "junit failure 2", severity: "warning"},
                {message: "junit skip 1", severity: "other"},
                {message: "junit skip 2", severity: "other"},
                {message: "android failure 1", severity: "error"},
                {message: "android failure 2", severity: "error"},
                {message: "android failure 3", severity: "error"},
                {message: "android warning 1", severity: "warning"},
                {message: "lint warning 1", severity: "warning"},
                {message: "lint warning 2", severity: "warning"},
                {message: "lint warning 3", severity: "warning"},
                {message: "lint other 2", severity: "other"},
                {message: "checkstyle error", severity: "error"},
                {message: "checkstyle warning", severity: "warning"},
                {message: "checkstyle notice", severity: "other"}
            ],
            checks: {
                checks: [
                    {
                        name: "Android Lint",
                        issues: {
                            "category1 / id1": {count: 2, severity: "error"},
                            "category2 / id2": {count: 1, severity: "error"},
                            "category2 / id3": {count: 4, severity: "warning"},
                            "category2 / id4": {count: 1, severity: "other"}
                        },
                        errors: 3,
                        others: 1,
                        warnings: 4
                    },
                    {
                        name: "Checkstyle",
                        issues: {
                            issue1: {count: 1, severity: "error"},
                            issue2: {count: 1, severity: "warning"},
                            issue3: {count: 3, severity: "other"}
                        },
                        errors: 1,
                        others: 1,
                        warnings: 1
                    }
                ],
                totals: {count: 11, errors: 4, others: 2, warnings: 5}
            },
            tests: {
                suites: [
                    {count: 2, failed: 0, name: "test1", passed: 0, skipped: 0},
                    {count: 6, failed: 1, name: "test2", passed: 3, skipped: 1},
                    {
                        count: 2,
                        failed: 0,
                        name: "test3",
                        passed: 0,
                        skipped: 2
                    },
                    {
                        count: 3,
                        failed: 0,
                        name: "test4",
                        passed: 0,
                        skipped: 3,
                        flaky: 1
                    }
                ],
                totals: {
                    count: 13,
                    failed: 1,
                    passed: 3,
                    skipped: 6,
                    flaky: 1
                }
            },
            totals: {errors: 5, others: 4, warnings: 6}
        }));
    });
});
