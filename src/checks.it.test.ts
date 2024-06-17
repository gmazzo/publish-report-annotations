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
                "annotations": 0,
                "conclusion": "success",
                "status": "completed",
                "summary": "",
                "title": "No issues found"
            },
            "Test Reports (computing flaky)": {
                "annotations": 10,
                "conclusion": "failure",
                "status": "completed",
                "summary": `|Test Suites|✅ 23 passed|🟡 1 skipped|❌ 4 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><br/>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><br/>✅ asArray when multiple elements, returns the same (⌛ <time>)<br/>✅ asArray when not a value, returns an empty array (⌛ <time>)<br/>✅ asArray when single element, returns it as an array (⌛ <time>)</details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><br/>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>❌ junitParser</summary><br/>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)<br/>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)<br/>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</details>|2|0|1|<time>
|<details><summary>✅ main</summary><br/>✅ main delegates to parsers and reports results (⌛ <time>)<br/>✅ main if error and should fail, expect to fail (⌛ <time>)<br/>✅ main if warnings and should fail, expect to fail (⌛ <time>)</details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><br/>✅ aTest[maxDuration=100] (⌛ <time>)<br/>✅ aTest[maxDuration=200] (⌛ <time>)<br/>✅ aTest[maxDuration=300] (⌛ <time>)<br/>✅ aTest[maxDuration=400] (⌛ <time>)</details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><br/>❌ failingTest() (⌛ <time>)</details>|0|0|1|<time>
|<details><summary>❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer]</summary><br/>❎❗[^flakyDisclaimer]flakyTest() (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><br/>🟡 a test skipped() (⌛ <time>)<br/>❌ a test that fails() (⌛ <time>)<br/>✅ a test that passes() (⌛ <time>)<br/>❌ a test that throws an exception() (⌛ <time>)</details>|1|1|2|<time>
|<details><summary>✅ processFile</summary><br/>✅ processFile delegates to parsers and reports results (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><br/>✅ readFile should return parsed XML file as JSON (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><br/>✅ resolveFile when file exists, just returns itself (⌛ <time>)<br/>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)<br/>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)<br/>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)<br/>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</details>|5|0|0|<time>
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                "title": "28 tests: ✅ 23 (❗1), 🟡 1, ❌ 4, checks: ⚠️ 5"
            },
            "Test Reports (full)": {
                "annotations": 15,
                "conclusion": "failure",
                "status": "completed",
                "summary": `|Test Suites|✅ 23 passed|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>✅ androidLintParser</summary><br/>✅ androidLintParser given lint xml should obtain annotations (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ asArray</summary><br/>✅ asArray when multiple elements, returns the same (⌛ <time>)<br/>✅ asArray when not a value, returns an empty array (⌛ <time>)<br/>✅ asArray when single element, returns it as an array (⌛ <time>)</details>|3|0|0|<time>
|<details><summary>✅ checkstyleParser</summary><br/>✅ checkstyleParser given detekt xml should obtain annotations (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>❌ junitParser</summary><br/>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)<br/>✅ junitParser given another junit xml should obtain annotations (⌛ <time>)<br/>✅ junitParser given junit xml should obtain annotations (⌛ <time>)</details>|2|0|1|<time>
|<details><summary>✅ main</summary><br/>✅ main delegates to parsers and reports results (⌛ <time>)<br/>✅ main if error and should fail, expect to fail (⌛ <time>)<br/>✅ main if warnings and should fail, expect to fail (⌛ <time>)</details>|3|0|0|<time>
|<details><summary>✅ org.test.sample.AnotherTestSuite</summary><br/>✅ aTest[maxDuration=100] (⌛ <time>)<br/>✅ aTest[maxDuration=200] (⌛ <time>)<br/>✅ aTest[maxDuration=300] (⌛ <time>)<br/>✅ aTest[maxDuration=400] (⌛ <time>)</details>|4|0|0|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)</details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><br/>❌ flakyTest() (⌛ <time>)<br/>❌ flakyTest() (⌛ <time>)<br/>✅ flakyTest() (⌛ <time>)</details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><br/>🟡 a test skipped() (⌛ <time>)<br/>❌ a test that fails() (⌛ <time>)<br/>✅ a test that passes() (⌛ <time>)<br/>❌ a test that throws an exception() (⌛ <time>)</details>|1|1|2|<time>
|<details><summary>✅ processFile</summary><br/>✅ processFile delegates to parsers and reports results (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ readFile</summary><br/>✅ readFile should return parsed XML file as JSON (⌛ <time>)</details>|1|0|0|<time>
|<details><summary>✅ resolveFile</summary><br/>✅ resolveFile when file exists, just returns itself (⌛ <time>)<br/>✅ resolveFile when is absolute path, just returns itself (⌛ <time>)<br/>✅ resolveFile when looking for a file but extension does not matches, it returns the same (⌛ <time>)<br/>✅ resolveFile when looking for a file with possible extensions, it returns a match (⌛ <time>)<br/>✅ resolveFile when looking for a file, it returns a match (⌛ <time>)</details>|5|0|0|<time>

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                "title": "34 tests: ✅ 23, 🟡 1, ❌ 10, checks: ⚠️ 5"
            },
            "Test Reports (omitting passed)": {
                "annotations": 15,
                "conclusion": "failure",
                "status": "completed",
                "summary": `|Test Suites|✅ 23 passed[^passedSkipDisclaimer]|🟡 1 skipped|❌ 10 failed|⌛ took
|:-|-|-|-|-
|<details><summary>❌ junitParser</summary><br/>❌ junitParser given a jest junit xml should obtain annotations (⌛ <time>)</details>|2|0|1|<time>
|<details><summary>❌ org.test.sample.FlakyFailingTestSuite</summary><br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)<br/>❌ failingTest() (⌛ <time>)</details>|0|0|5|<time>
|<details><summary>❌ org.test.sample.FlakyTestSuite</summary><br/>❌ flakyTest() (⌛ <time>)<br/>❌ flakyTest() (⌛ <time>)</details>|1|0|2|<time>
|<details><summary>❌ org.test.sample.SampleTestSuite</summary><br/>🟡 a test skipped() (⌛ <time>)<br/>❌ a test that fails() (⌛ <time>)<br/>❌ a test that throws an exception() (⌛ <time>)</details>|1|1|2|<time>
[^passedSkipDisclaimer]: ✅ passed suites were not reported

|Android Lint|🛑 0 errors|⚠️ 4 warnings|💡 0 others|
|:-|-|-|-|
|Correctness / GradleDependency|0|1|0|
|Performance / VectorPath|0|3|0|

|Detekt|🛑 0 errors|⚠️ 1 warning|💡 0 others|
|:-|-|-|-|
|NewLineAtEndOfFile|0|1|0|

`,
                "title": "34 tests: ✅ 23, 🟡 1, ❌ 10, checks: ⚠️ 5"
            }
        });
    });
});
