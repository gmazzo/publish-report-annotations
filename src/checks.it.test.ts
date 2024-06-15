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
                summary: `|Test Suites|✅ 93 passed|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ 3.132)</li><li>✅ androidLintParser given lint xml, but filtering, expect no annotations (⌛ 0.009)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ 1.021)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when single element, returns it as an array (⌛ 0.003)</li><li>✅ asArray when multiple elements, returns the same</li><li>✅ asArray when not a value, returns an empty array (⌛ 0.001)</li><li>✅ join joins multiple non black elements (⌛ 0.001)</li><li>✅ join joins multiple non black elements, when some are empty or undefined</li><li>✅ shouldFail if error, then true (⌛ 0.001)</li><li>✅ shouldFail if only warnings, then false</li><li>✅ shouldFail if only warnings and counting as errors, then true</li><li>✅ shouldFail if only others, then false (⌛ 0.001)</li></ul></details>|9|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when single element, returns it as an array (⌛ 0.003)</li><li>✅ asArray when multiple elements, returns the same</li><li>✅ asArray when not a value, returns an empty array (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ 3.174)</li><li>✅ checkstyleParser given detekt xml, but filtering, expect no annotations (⌛ 0.017)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ 1.04)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ config</summary><ul><li>✅ config can read config [testsSummaryInput="full", checksSummaryInput="off"] (⌛ 0.033)</li><li>✅ config can read config [testsSummaryInput="suitesOnly", checksSummaryInput="off"] (⌛ 0.007)</li><li>✅ config can read config [testsSummaryInput="totals", checksSummaryInput="off"] (⌛ 0.002)</li><li>✅ config can read config [testsSummaryInput="<other>", checksSummaryInput="off"] (⌛ 0.015)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="full"] (⌛ 0.003)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="totals"] (⌛ 0.004)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="<other>"] (⌛ 0.001)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailed"] (⌛ 0.001)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailedWithoutPassed"] (⌛ 0.015)</li><li>✅ config when legacy summary is given, overrides new ones [summary="totals"] (⌛ 0.002)</li><li>✅ config when legacy summary is given, overrides new ones [summary="off"] (⌛ 0.002)</li><li>✅ config when legacy summary is given, overrides new ones [summary="<other>"] (⌛ 0.002)</li></ul></details>|12|0|0|<time>
|<details><summary>✅ fileFilter</summary><ul><li>✅ fileFilter should return true, for files in the PR (⌛ 0.003)</li><li>✅ fileFilter should return false and log, for files not in the PR (⌛ 0.002)</li><li>✅ fileFilter if file is missing, it should not be filtered (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ getPRFiles</summary><ul><li>✅ getPRFiles get without any statuses, returns all files (⌛ 0.005)</li><li>✅ getPRFiles get for added, returns just added files (⌛ 0.001)</li><li>✅ getPRFiles get other statuses, returns the expected files (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ junitParser</summary><ul><li>✅ junitParser given junit xml should obtain annotations (⌛ 0.07)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ 0.003)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=false] (⌛ 0.006)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=true] (⌛ 0.005)</li><li>✅ junitParser given a junit xml with retries that always fails, should process it correctly (⌛ 0.029)</li><li>✅ junitParser given a jest junit xml should obtain annotations (⌛ 0.016)</li></ul></details>|6|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>✅ junitParser given junit xml should obtain annotations (⌛ 0.007)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ 0.001)</li><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ 0.002)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results [filterChecks=true] (⌛ 0.018)</li><li>✅ main delegates to parsers and reports results [filterChecks=false] (⌛ 0.011)</li><li>✅ main if error and should fail, expect to fail (⌛ 0.001)</li><li>✅ main if warnings and should fail, expect to fail (⌛ 0.001)</li></ul></details>|4|0|0|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ 0.047)</li><li>✅ main if error and should fail, expect to fail</li><li>✅ main if warnings and should fail, expect to fail (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ 0.054)</li><li>✅ aTest[maxDuration=200] (⌛ 0.107)</li><li>✅ aTest[maxDuration=300] (⌛ 0.238)</li><li>✅ aTest[maxDuration=400] (⌛ 0.103)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ 0.011)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.011)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ 0.005)</li><li>❌ flakyTest() (⌛ 0.005)</li><li>✅ flakyTest() (⌛ 0.005)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped()</li><li>✅ a test that passes() (⌛ 0.001)</li><li>❌ a test that fails() (⌛ 0.002)</li><li>❌ a test that throws an exception() (⌛ 0.001)</li></ul></details>|1|1|2|<time>
|<details><summary>✅ ParseResults</summary><ul><li>✅ ParseResults mergeWith combine results correctly (⌛ 0.026)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile for a junit file [doNotAnnotate=true] (⌛ 0.006)</li><li>✅ processFile for a junit file [doNotAnnotate=false] (⌛ 0.002)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=true] (⌛ 0.002)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=false] (⌛ 0.003)</li><li>✅ processFile for a android lint file [doNotAnnotate=true] (⌛ 0.002)</li><li>✅ processFile for a android lint file [doNotAnnotate=false] (⌛ 0.001)</li></ul></details>|6|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ 0.004)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ publishCheck</summary><ul><li>✅ publishCheck publishes check [checkExists=false] (⌛ 0.008)</li><li>✅ publishCheck publishes check [checkExists=true] (⌛ 0.001)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ 0.033)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ 0.018)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when is absolute path, just returns itself (⌛ 0.003)</li><li>✅ resolveFile when file exists, just returns itself</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ 3.126)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ 1.656)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ 1.342)</li><li>✅ resolveFile when location is found, it can be used without globbing again (⌛ 1.411)</li><li>✅ resolveFile if location is not in git, then it should keep looking (⌛ 1.362)</li></ul></details>|7|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when is absolute path, just returns itself (⌛ 0.002)</li><li>✅ resolveFile when file exists, just returns itself</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ 1.031)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ 0.617)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ 0.568)</li></ul></details>|5|0|0|<time>
|<details><summary>✅ summaryOf</summary><ul><li>✅ summaryOf only tests, all passed (⌛ 0.007)</li><li>✅ summaryOf only tests, with failures</li><li>✅ summaryOf only tests, with retries (⌛ 0.001)</li><li>✅ summaryOf only checks (⌛ 0.001)</li><li>✅ summaryOf tests and checks (⌛ 0.001)</li><li>✅ summaryOf tests and checks, but simplified</li><li>✅ summaryTableOf when summary is suites only (default), returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is full, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is without passed, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when only warnings, returns the expected result</li><li>✅ summaryTableOf when summary is totals, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is off, returns an empty string</li></ul></details>|12|0|0|<time>

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
            "Test Reports (Computing Flaky)": {
                annotations: 10,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 93 passed|🟡 1 skipped|❌ 4 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ 3.132)</li><li>✅ androidLintParser given lint xml, but filtering, expect no annotations (⌛ 0.009)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ 1.021)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when single element, returns it as an array (⌛ 0.003)</li><li>✅ asArray when multiple elements, returns the same</li><li>✅ asArray when not a value, returns an empty array (⌛ 0.001)</li><li>✅ join joins multiple non black elements (⌛ 0.001)</li><li>✅ join joins multiple non black elements, when some are empty or undefined</li><li>✅ shouldFail if error, then true (⌛ 0.001)</li><li>✅ shouldFail if only warnings, then false</li><li>✅ shouldFail if only warnings and counting as errors, then true</li><li>✅ shouldFail if only others, then false (⌛ 0.001)</li></ul></details>|9|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when single element, returns it as an array (⌛ 0.003)</li><li>✅ asArray when multiple elements, returns the same</li><li>✅ asArray when not a value, returns an empty array (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ 3.174)</li><li>✅ checkstyleParser given detekt xml, but filtering, expect no annotations (⌛ 0.017)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ 1.04)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ config</summary><ul><li>✅ config can read config [testsSummaryInput="full", checksSummaryInput="off"] (⌛ 0.033)</li><li>✅ config can read config [testsSummaryInput="suitesOnly", checksSummaryInput="off"] (⌛ 0.007)</li><li>✅ config can read config [testsSummaryInput="totals", checksSummaryInput="off"] (⌛ 0.002)</li><li>✅ config can read config [testsSummaryInput="<other>", checksSummaryInput="off"] (⌛ 0.015)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="full"] (⌛ 0.003)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="totals"] (⌛ 0.004)</li><li>✅ config can read config [testsSummaryInput="off", checksSummaryInput="<other>"] (⌛ 0.001)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailed"] (⌛ 0.001)</li><li>✅ config when legacy summary is given, overrides new ones [summary="detailedWithoutPassed"] (⌛ 0.015)</li><li>✅ config when legacy summary is given, overrides new ones [summary="totals"] (⌛ 0.002)</li><li>✅ config when legacy summary is given, overrides new ones [summary="off"] (⌛ 0.002)</li><li>✅ config when legacy summary is given, overrides new ones [summary="<other>"] (⌛ 0.002)</li></ul></details>|12|0|0|<time>
|<details><summary>✅ fileFilter</summary><ul><li>✅ fileFilter should return true, for files in the PR (⌛ 0.003)</li><li>✅ fileFilter should return false and log, for files not in the PR (⌛ 0.002)</li><li>✅ fileFilter if file is missing, it should not be filtered (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ getPRFiles</summary><ul><li>✅ getPRFiles get without any statuses, returns all files (⌛ 0.005)</li><li>✅ getPRFiles get for added, returns just added files (⌛ 0.001)</li><li>✅ getPRFiles get other statuses, returns the expected files (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ junitParser</summary><ul><li>✅ junitParser given junit xml should obtain annotations (⌛ 0.07)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ 0.003)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=false] (⌛ 0.006)</li><li>✅ junitParser given a junit xml with retries should process it correctly [detectFlakyTests=true] (⌛ 0.005)</li><li>✅ junitParser given a junit xml with retries that always fails, should process it correctly (⌛ 0.029)</li><li>✅ junitParser given a jest junit xml should obtain annotations (⌛ 0.016)</li></ul></details>|6|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>✅ junitParser given junit xml should obtain annotations (⌛ 0.007)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ 0.001)</li><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ 0.002)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results [filterChecks=true] (⌛ 0.018)</li><li>✅ main delegates to parsers and reports results [filterChecks=false] (⌛ 0.011)</li><li>✅ main if error and should fail, expect to fail (⌛ 0.001)</li><li>✅ main if warnings and should fail, expect to fail (⌛ 0.001)</li></ul></details>|4|0|0|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ 0.047)</li><li>✅ main if error and should fail, expect to fail</li><li>✅ main if warnings and should fail, expect to fail (⌛ 0.001)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ 0.054)</li><li>✅ aTest[maxDuration=200] (⌛ 0.107)</li><li>✅ aTest[maxDuration=300] (⌛ 0.238)</li><li>✅ aTest[maxDuration=400] (⌛ 0.103)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ 0.011)</li></ul></details>|0|0|1|<time>
|<details><summary>❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer]</summary><ul><li>❎❗[^flakyDisclaimer]flakyTest() (⌛ 0.005)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped()</li><li>✅ a test that passes() (⌛ 0.001)</li><li>❌ a test that fails() (⌛ 0.002)</li><li>❌ a test that throws an exception() (⌛ 0.001)</li></ul></details>|1|1|2|<time>
|<details><summary>✅ ParseResults</summary><ul><li>✅ ParseResults mergeWith combine results correctly (⌛ 0.026)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile for a junit file [doNotAnnotate=true] (⌛ 0.006)</li><li>✅ processFile for a junit file [doNotAnnotate=false] (⌛ 0.002)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=true] (⌛ 0.002)</li><li>✅ processFile for a checkstyle file [doNotAnnotate=false] (⌛ 0.003)</li><li>✅ processFile for a android lint file [doNotAnnotate=true] (⌛ 0.002)</li><li>✅ processFile for a android lint file [doNotAnnotate=false] (⌛ 0.001)</li></ul></details>|6|0|0|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ 0.004)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ publishCheck</summary><ul><li>✅ publishCheck publishes check [checkExists=false] (⌛ 0.008)</li><li>✅ publishCheck publishes check [checkExists=true] (⌛ 0.001)</li></ul></details>|2|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ 0.033)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ 0.018)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when is absolute path, just returns itself (⌛ 0.003)</li><li>✅ resolveFile when file exists, just returns itself</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ 3.126)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ 1.656)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ 1.342)</li><li>✅ resolveFile when location is found, it can be used without globbing again (⌛ 1.411)</li><li>✅ resolveFile if location is not in git, then it should keep looking (⌛ 1.362)</li></ul></details>|7|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when is absolute path, just returns itself (⌛ 0.002)</li><li>✅ resolveFile when file exists, just returns itself</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ 1.031)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ 0.617)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ 0.568)</li></ul></details>|5|0|0|<time>
|<details><summary>✅ summaryOf</summary><ul><li>✅ summaryOf only tests, all passed (⌛ 0.007)</li><li>✅ summaryOf only tests, with failures</li><li>✅ summaryOf only tests, with retries (⌛ 0.001)</li><li>✅ summaryOf only checks (⌛ 0.001)</li><li>✅ summaryOf tests and checks (⌛ 0.001)</li><li>✅ summaryOf tests and checks, but simplified</li><li>✅ summaryTableOf when summary is suites only (default), returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is full, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is without passed, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when only warnings, returns the expected result</li><li>✅ summaryTableOf when summary is totals, returns the expected result (⌛ 0.001)</li><li>✅ summaryTableOf when summary is off, returns an empty string</li></ul></details>|12|0|0|<time>
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
            "Test Reports (Omitting Passed)": {
                annotations: 15,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 93 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ 0.002)</li></ul></details>|2|0|1|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ 0.011)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.01)</li><li>❌ failingTest() (⌛ 0.011)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ 0.005)</li><li>❌ flakyTest() (⌛ 0.005)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped()</li><li>❌ a test that fails() (⌛ 0.002)</li><li>❌ a test that throws an exception() (⌛ 0.001)</li></ul></details>|1|1|2|<time>
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
            },
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
            }
        });
    });
});
