import * as github from '@actions/github';
import child_process from 'child_process';

describe('checks', () => {
    it('PR checks outcome should be the expected ones', async () => {
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);
        const commit = process.env.COMMIT_SHA || child_process
            .execSync('git rev-parse HEAD')
            .toString().trim();

        // noinspection CommaExpressionJS
        const checks = (await octokit.rest.checks
            .listForRef({...github.context.repo, ref: commit}))
            .data.check_runs
            .filter(check => check.name.startsWith('Test Reports'))
            .reduce((acc, check) => (acc[check.name] = {
                status: check.status,
                conclusion: check.conclusion,
                title: check.output.title,
                summary: check.output.summary?.replace(/(⌛ )[\d.]+|[\d.]+(\n)/g, '$1<time>$2'),
                annotations: check.output.annotations_count
            }, acc), {} as { [key: string]: object });

        expect(checks).toStrictEqual({
            "Test Reports (PR filtered)": {
                annotations: 0,
                conclusion: "success",
                status: "completed",
                summary: `|Test Suites|✅ 70 passed|🟡 0 skipped|❌ 0 failed|⌛ took
|:-|-|-|-|-
|✅ androidLintParser|2|0|0|<time>
|✅ asArray|9|0|0|<time>
|✅ checkstyleParser|2|0|0|<time>
|✅ config|12|0|0|<time>
|✅ fileFilter|3|0|0|<time>
|✅ getPRFiles|3|0|0|<time>
|✅ junitParser|6|0|0|<time>
|✅ main|4|0|0|<time>
|✅ ParseResults|1|0|0|<time>
|✅ processFile|6|0|0|<time>
|✅ publishCheck|2|0|0|<time>
|✅ readFile|1|0|0|<time>
|✅ resolveFile|7|0|0|<time>
|✅ summaryOf|12|0|0|<time>
`,
                title: "70 tests ✅ passed"
            },
            "Test Reports (computing flaky)": {
                annotations: 10,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 93 passed|🟡 1 skipped|❌ 4 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li><li>✅ androidLintParser given lint xml, but filtering, expect no annotations (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li><li>✅ join joins multiple non black elements (⌛ <time>)</li><li>✅ join joins multiple non black elements, when some are empty or undefined (⌛ <time>)</li><li>✅ shouldFail if error, then true (⌛ <time>)</li><li>✅ shouldFail if only others, then false (⌛ <time>)</li><li>✅ shouldFail if only warnings and counting as errors, then true (⌛ <time>)</li><li>✅ shouldFail if only warnings, then false (⌛ <time>)</li></ul></details>|9|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li><li>✅ checkstyleParser given detekt xml, but filtering, expect no annotations (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ config</summary><ul><li>✅ config can read config [testsSummaryInput="<other>", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="full", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="<other>"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="full"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="totals"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="suitesOnly", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="totals", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="<other>"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailed"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailedWithoutPassed"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="off"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="totals"] (⌛ <time>)</li></ul></details>|12|0|0|<time>
|<details><summary>✅ fileFilter</summary><ul><li>✅ fileFilter if file is missing, it should not be filtered (⌛ <time>)</li><li>✅ fileFilter should return false and log, for files not in the PR (⌛ <time>)</li><li>✅ fileFilter should return true, for files in the PR (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ getPRFiles</summary><ul><li>✅ getPRFiles get for added, returns just added files (⌛ <time>)</li><li>✅ getPRFiles get other statuses, returns the expected files (⌛ <time>)</li><li>✅ getPRFiles get without any statuses, returns all files (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ junitParser</summary><ul><li>✅ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=false] (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=true] (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries that always fails, should process it correctly (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|6|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results [filterChecks=false] (⌛ <time>)</li><li>✅ main delegates to parsers and reports results [filterChecks=true] (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ <time>)</li><li>✅ aTest[maxDuration=200] (⌛ <time>)</li><li>✅ aTest[maxDuration=300] (⌛ <time>)</li><li>✅ aTest[maxDuration=400] (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|1|<time>
|<details><summary>❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer]</summary><ul><li>❎❗[^flakyDisclaimer]flakyTest() (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>✅ a test that passes() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>✅ ParseResults</summary><ul><li>✅ ParseResults mergeWith combine results correctly (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile for a android lint file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a android lint file [doNotAnnotate=true] (⌛ <time>)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=true] (⌛ <time>)</li><li>✅ processFile for a junit file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a junit file [doNotAnnotate=true] (⌛ <time>)</li></ul></details>|6|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ publishCheck</summary><ul><li>✅ publishCheck publishes check [checkExists=false] (⌛ <time>)</li><li>✅ publishCheck publishes check [checkExists=true] (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile if location is not in git, then it should keep looking (⌛ <time>)</li><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when location is found, it can be used without globbing again (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|7|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|5|0|0|<time>
|<details><summary>✅ summaryOf</summary><ul><li>✅ summaryOf only checks (⌛ <time>)</li><li>✅ summaryOf only tests, all passed (⌛ <time>)</li><li>✅ summaryOf only tests, with failures (⌛ <time>)</li><li>✅ summaryOf only tests, with retries (⌛ <time>)</li><li>✅ summaryOf tests and checks (⌛ <time>)</li><li>✅ summaryOf tests and checks, but simplified (⌛ <time>)</li><li>✅ summaryTableOf when only warnings, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is full, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is off, returns an empty string (⌛ <time>)</li><li>✅ summaryTableOf when summary is suites only (default), returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is totals, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is without passed, returns the expected result (⌛ <time>)</li></ul></details>|12|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "98 tests: ✅ 93 (❗1), 🟡 1, ❌ 4, checks: ⚠️ 5"
            },
            "Test Reports (full)": {
                annotations: 15,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 93 passed|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li><li>✅ androidLintParser given lint xml, but filtering, expect no annotations (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li><li>✅ join joins multiple non black elements (⌛ <time>)</li><li>✅ join joins multiple non black elements, when some are empty or undefined (⌛ <time>)</li><li>✅ shouldFail if error, then true (⌛ <time>)</li><li>✅ shouldFail if only others, then false (⌛ <time>)</li><li>✅ shouldFail if only warnings and counting as errors, then true (⌛ <time>)</li><li>✅ shouldFail if only warnings, then false (⌛ <time>)</li></ul></details>|9|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li><li>✅ checkstyleParser given detekt xml, but filtering, expect no annotations (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ config</summary><ul><li>✅ config can read config [testsSummaryInput="<other>", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="full", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="<other>"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="full"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="totals"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="suitesOnly", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config can read config [testsSummaryInput="totals", checksSummaryInput="off"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="<other>"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailed"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailedWithoutPassed"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="off"] (⌛ <time>)</li><li>✅ config when legacy summary is given, overrides new ones [summary="totals"] (⌛ <time>)</li></ul></details>|12|0|0|<time>
|<details><summary>✅ fileFilter</summary><ul><li>✅ fileFilter if file is missing, it should not be filtered (⌛ <time>)</li><li>✅ fileFilter should return false and log, for files not in the PR (⌛ <time>)</li><li>✅ fileFilter should return true, for files in the PR (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ getPRFiles</summary><ul><li>✅ getPRFiles get for added, returns just added files (⌛ <time>)</li><li>✅ getPRFiles get other statuses, returns the expected files (⌛ <time>)</li><li>✅ getPRFiles get without any statuses, returns all files (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ junitParser</summary><ul><li>✅ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=false] (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=true] (⌛ <time>)</li><li>✅ junitParser given a junit xml with retries that always fails, should process it correctly (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|6|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results [filterChecks=false] (⌛ <time>)</li><li>✅ main delegates to parsers and reports results [filterChecks=true] (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ <time>)</li><li>✅ aTest[maxDuration=200] (⌛ <time>)</li><li>✅ aTest[maxDuration=300] (⌛ <time>)</li><li>✅ aTest[maxDuration=400] (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ <time>)</li><li>❌ flakyTest() (⌛ <time>)</li><li>✅ flakyTest() (⌛ <time>)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>✅ a test that passes() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>✅ ParseResults</summary><ul><li>✅ ParseResults mergeWith combine results correctly (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile for a android lint file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a android lint file [doNotAnnotate=true] (⌛ <time>)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=true] (⌛ <time>)</li><li>✅ processFile for a junit file [doNotAnnotate=false] (⌛ <time>)</li><li>✅ processFile for a junit file [doNotAnnotate=true] (⌛ <time>)</li></ul></details>|6|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ publishCheck</summary><ul><li>✅ publishCheck publishes check [checkExists=false] (⌛ <time>)</li><li>✅ publishCheck publishes check [checkExists=true] (⌛ <time>)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile if location is not in git, then it should keep looking (⌛ <time>)</li><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when location is found, it can be used without globbing again (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|7|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|5|0|0|<time>
|<details><summary>✅ summaryOf</summary><ul><li>✅ summaryOf only checks (⌛ <time>)</li><li>✅ summaryOf only tests, all passed (⌛ <time>)</li><li>✅ summaryOf only tests, with failures (⌛ <time>)</li><li>✅ summaryOf only tests, with retries (⌛ <time>)</li><li>✅ summaryOf tests and checks (⌛ <time>)</li><li>✅ summaryOf tests and checks, but simplified (⌛ <time>)</li><li>✅ summaryTableOf when only warnings, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is full, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is off, returns an empty string (⌛ <time>)</li><li>✅ summaryTableOf when summary is suites only (default), returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is totals, returns the expected result (⌛ <time>)</li><li>✅ summaryTableOf when summary is without passed, returns the expected result (⌛ <time>)</li></ul></details>|12|0|0|<time>

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "104 tests: ✅ 93, 🟡 1, ❌ 10, checks: ⚠️ 5"
            },
            "Test Reports (omitting passed)": {
                annotations: 15,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 93 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ <time>)</li><li>❌ flakyTest() (⌛ <time>)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
[^passedSkipDisclaimer]: ✅ passed suites were not reported

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "104 tests: ✅ 93, 🟡 1, ❌ 10, checks: ⚠️ 5"
            }
        });
    });
});
