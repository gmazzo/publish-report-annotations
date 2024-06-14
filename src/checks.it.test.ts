import * as github from '@actions/github';

describe('checks', () => {
    it('PR checks outcome should be the expected ones', async () => {
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

        // noinspection CommaExpressionJS
        const checks = (await octokit.rest.checks
            .listForRef({...github.context.repo, ref: process.env.COMMIT_SHA!}))
            .data.check_runs
            .filter(check => check.name.startsWith('Test Reports'))
            .reduce((acc, check) => (acc[check.name] = {
                status: check.status,
                conclusion: check.conclusion,
                title: check.output.title,
                summary: check.output.summary?.replace(/\d+\.?\d*s/g, '<time>'),
                annotations: check.output.annotations_count
            }, acc), {} as { [key: string]: object });

        expect(checks).toStrictEqual({
            "Test Reports": {
                annotations: 15,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 85 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|❌ junitParser|2|0|1|<time>
|❌ org.test.sample.FlakyFailingTestSuite|0|0|5|<time>
|❌ org.test.sample.FlakyTestSuite|1|0|2|<time>
|❌ org.test.sample.SampleTestSuite|1|1|2|<time>
[^passedSkipDisclaimer]: ✅ passed suites were not reported

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "96 tests: ✅ 85, 🟡 1, ❌ 10, checks: ⚠️ 5"
            },
            "Test Reports (Ignoring Flaky)": {
                annotations: 10,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 85 passed|🟡 1 skipped|❌ 4 failed|⌛ took
|:-|-|-|-|-
|✅ androidLintParser|2|0|0|<time>
|✅ androidLintParser|1|0|0|<time>
|✅ asArray|9|0|0|<time>
|✅ asArray|3|0|0|<time>
|✅ checkstyleParser|2|0|0|<time>
|✅ checkstyleParser|1|0|0|<time>
|✅ config|5|0|0|<time>
|✅ fileFilter|3|0|0|<time>
|✅ getPRFiles|3|0|0|<time>
|✅ junitParser|6|0|0|<time>
|❌ junitParser|2|0|1|<time>
|✅ main|4|0|0|<time>
|✅ main|3|0|0|<time>
|✅ org.test.sample.AnotherTestSuite|4|0|0|<time>
|❌ org.test.sample.FlakyFailingTestSuite|0|0|1|<time>
|❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer]|1|0|0|<time>
|❌ org.test.sample.SampleTestSuite|1|1|2|<time>
|✅ ParseResults|1|0|0|<time>
|✅ processFile|6|0|0|<time>
|✅ processFile|1|0|0|<time>
|✅ publishCheck|2|0|0|<time>
|✅ readFile|1|0|0|<time>
|✅ readFile|1|0|0|<time>
|✅ resolveFile|7|0|0|<time>
|✅ resolveFile|5|0|0|<time>
|✅ summaryOf|11|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "90 tests: ✅ 85 (❗1), 🟡 1, ❌ 4, checks: ⚠️ 5"
            },
            "Test Reports (PR filtered)": {
                annotations: 0,
                conclusion: "success",
                status: "completed",
                summary: `|Test Suites|✅ 62 passed|🟡 0 skipped|❌ 0 failed|⌛ took
|:-|-|-|-|-
|✅ androidLintParser|2|0|0|<time>
|✅ asArray|9|0|0|<time>
|✅ checkstyleParser|2|0|0|<time>
|✅ config|5|0|0|<time>
|✅ fileFilter|3|0|0|<time>
|✅ getPRFiles|3|0|0|<time>
|✅ junitParser|6|0|0|<time>
|✅ main|4|0|0|<time>
|✅ ParseResults|1|0|0|<time>
|✅ processFile|6|0|0|<time>
|✅ publishCheck|2|0|0|<time>
|✅ readFile|1|0|0|<time>
|✅ resolveFile|7|0|0|<time>
|✅ summaryOf|11|0|0|<time>
`,
                title: "62 tests ✅ passed"
            }
        });
    });
});
