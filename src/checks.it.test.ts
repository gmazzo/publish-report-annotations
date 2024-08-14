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
                summary: "",
                title: "No issues found"
            },
            "Test Reports (computing flaky)": {
                annotations: 14,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 28 passed|🟡 1 skipped|❌ 6 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌❗ [^flakyDisclaimer]</summary><ul><li>❌ flakyTest (⌛ <time>)</li><li>❎❗[^flakyDisclaimer]i_can_see_map_screen_for_delivering_orders (⌛ <time>)</li><li>✅ userCanApplyGroupFilters (⌛ <time>)</li><li>✅ userCanOpenAndApplyFilters (⌛ <time>)</li></ul></details>|3|0|1|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ <time>)</li><li>✅ aTest[maxDuration=200] (⌛ <time>)</li><li>✅ aTest[maxDuration=300] (⌛ <time>)</li><li>✅ aTest[maxDuration=400] (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|1|<time>
|<details><summary>❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer]</summary><ul><li>❎❗[^flakyDisclaimer]flakyTest() (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>✅ a test that passes() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>❌ org.test.Test</summary><ul><li>✅ andAfterReset (⌛ <time>)</li><li>✅ isDeterministic (⌛ <time>)</li><li>❌ testScene[CLEAR at 2024-08-01T00:00+02:00[Europe/Madrid]] (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|5|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "35 tests: ✅ 28 (❗2), 🟡 1, ❌ 6, checks: ⚠️ 5"
            },
            "Test Reports (full)": {
                annotations: 19,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 28 passed|🟡 1 skipped|❌ 12 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌❗ [^flakyDisclaimer]</summary><ul><li>❌ flakyTest (⌛ <time>)</li><li>❎❗[^flakyDisclaimer]i_can_see_map_screen_for_delivering_orders (⌛ <time>)</li><li>✅ userCanApplyGroupFilters (⌛ <time>)</li><li>✅ userCanOpenAndApplyFilters (⌛ <time>)</li></ul></details>|3|0|1|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ <time>)</li><li>✅ aTest[maxDuration=200] (⌛ <time>)</li><li>✅ aTest[maxDuration=300] (⌛ <time>)</li><li>✅ aTest[maxDuration=400] (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ <time>)</li><li>❌ flakyTest() (⌛ <time>)</li><li>✅ flakyTest() (⌛ <time>)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>✅ a test that passes() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>❌ org.test.Test</summary><ul><li>✅ andAfterReset (⌛ <time>)</li><li>✅ isDeterministic (⌛ <time>)</li><li>❌ testScene[CLEAR at 2024-08-01T00:00+02:00[Europe/Madrid]] (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|5|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "41 tests: ✅ 28 (❗1), 🟡 1, ❌ 12, checks: ⚠️ 5"
            },
            "Test Reports (omitting passed)": {
                annotations: 19,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 28 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 12 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌❗ [^flakyDisclaimer]</summary><ul><li>❌ flakyTest (⌛ <time>)</li><li>❎❗[^flakyDisclaimer]i_can_see_map_screen_for_delivering_orders (⌛ <time>)</li></ul></details>|3|0|1|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ <time>)</li><li>❌ flakyTest() (⌛ <time>)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>❌ org.test.Test</summary><ul><li>❌ testScene[CLEAR at 2024-08-01T00:00+02:00[Europe/Madrid]] (⌛ <time>)</li></ul></details>|2|0|1|<time>
[^passedSkipDisclaimer]: ✅ passed suites were not reported
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "41 tests: ✅ 28 (❗1), 🟡 1, ❌ 12, checks: ⚠️ 5"
            },
            "Test Reports (GitHub App)": {
                annotations: 19,
                conclusion: "failure",
                status: "completed",
                summary: `|Test Suites|✅ 28 passed|🟡 1 skipped|❌ 12 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌❗ [^flakyDisclaimer]</summary><ul><li>❌ flakyTest (⌛ <time>)</li><li>❎❗[^flakyDisclaimer]i_can_see_map_screen_for_delivering_orders (⌛ <time>)</li><li>✅ userCanApplyGroupFilters (⌛ <time>)</li><li>✅ userCanOpenAndApplyFilters (⌛ <time>)</li></ul></details>|3|0|1|<time>
|<details><summary>✅ androidLintParser</summary><ul><li>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><ul><li>✅ asArray when multiple elements, returns the same (⌛ <time>)</li><li>✅ asArray when not a value, returns an empty array (⌛ <time>)</li><li>✅ asArray when single element, returns it as an array (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><ul><li>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>❌ junitParser</summary><ul><li>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)</li><li>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ main</summary><ul><li>✅ main delegates to parsers and reports results (⌛ <time>)</li><li>✅ main if error and should fail, expect to fail (⌛ <time>)</li><li>✅ main if warnings and should fail, expect to fail (⌛ <time>)</li></ul></details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><ul><li>✅ aTest[maxDuration=100] (⌛ <time>)</li><li>✅ aTest[maxDuration=200] (⌛ <time>)</li><li>✅ aTest[maxDuration=300] (⌛ <time>)</li><li>✅ aTest[maxDuration=400] (⌛ <time>)</li></ul></details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><ul><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li><li>❌ failingTest() (⌛ <time>)</li></ul></details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><ul><li>❌ flakyTest() (⌛ <time>)</li><li>❌ flakyTest() (⌛ <time>)</li><li>✅ flakyTest() (⌛ <time>)</li></ul></details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><ul><li>🟡 a test skipped() (⌛ <time>)</li><li>❌ a test that fails() (⌛ <time>)</li><li>✅ a test that passes() (⌛ <time>)</li><li>❌ a test that throws an exception() (⌛ <time>)</li></ul></details>|1|1|2|<time>
|<details><summary>❌ org.test.Test</summary><ul><li>✅ andAfterReset (⌛ <time>)</li><li>✅ isDeterministic (⌛ <time>)</li><li>❌ testScene[CLEAR at 2024-08-01T00:00+02:00[Europe/Madrid]] (⌛ <time>)</li></ul></details>|2|0|1|<time>
|<details><summary>✅ processFile</summary><ul><li>✅ processFile delegates to parsers and reports results (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><ul><li>✅ readFile should return parsed XML file as JSON (⌛ <time>)</li></ul></details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><ul><li>✅ resolveFile when file exists, just returns itself (⌛ <time>)</li><li>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)</li><li>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)</li><li>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)</li><li>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</li></ul></details>|5|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                title: "41 tests: ✅ 28 (❗1), 🟡 1, ❌ 12, checks: ⚠️ 5"
            },
            "Test Reports (No Reports)": {
                annotations: 0,
                conclusion: "failure",
                status: "completed",
                summary: "",
                title: "❗No report files found"
            },
        });
    });
});
