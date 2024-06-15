![GitHub](https://img.shields.io/github/license/gmazzo/publish-report-annotations)
[![Latest](https://img.shields.io/github/v/release/gmazzo/publish-report-annotations)](https://github.com/gmazzo/publish-report-annotations/releases/latest)
[![Build Status](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml/badge.svg)](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml)
[![codecov](https://codecov.io/gh/gmazzo/publish-report-annotations/branch/main/graph/badge.svg)](https://codecov.io/gh/gmazzo/publish-report-annotations)
[![Users](https://img.shields.io/badge/users_by-Sourcegraph-purple)](https://sourcegraph.com/search?q=content:gmazzo/publish-report-annotations%40+-repo:github.com/gmazzo/publish-report-annotations)

# publish-report-annotations
Reports JUnit, Android Lint, Detekt and any other CheckStyle compatible XML reports as GitHub Actions annotations.
Mostly targeting Gradle builds

#### JUnit's reports
![junit](https://github.com/gmazzo/publish-report-annotations/assets/513566/57ba4328-0318-48b5-9d91-22113c4387bb)

#### Checkstyle (and compatibles, like Detekt)s reports
![checkstyle/detekt](https://github.com/gmazzo/publish-report-annotations/assets/513566/10979561-f1d3-48ef-a168-d416d866f2cc)

#### Android Lint's reports
![android lint](https://github.com/gmazzo/publish-report-annotations/assets/513566/cedf8726-0633-43d4-ae6a-3371362f3e8c)

#### Detailed logs
![logs](https://github.com/gmazzo/publish-report-annotations/assets/513566/4d2a3224-c326-4948-bf58-6aec18715818)

#### Summaries
![PR status check](https://github.com/gmazzo/publish-report-annotations/assets/513566/434289a0-6d4d-4226-ad4c-49554080df80)

| Tests                                               | ✅ 5 passed | 🟡 1 skipped | ❌ 2 failed | ⌛ took |
|:----------------------------------------------------|------------|--------------|------------|--------|
| ✅ org.test.sample.AnotherTestSuite                  | 4          | 0            | 0          | 0.578s |
| ❌ org.test.sample.SampleTestSuite                   | 1          | 1            | 2          | 0.002s |
| ❎❗org.test.sample.FlakyTestSuite [^flakyDisclaimer] | 1          | 0            | 0          | 1.295s |
[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)

| detekt             | 🛑 0 errors | ⚠️ 1 warning | 💡 0 others |
|:-------------------|-------------|--------------|-------------|
| NewLineAtEndOfFile | 0           | 1            | 0           |

| Android Lint                   | 🛑 0 errors | ⚠️ 1 warning | 💡 0 others |
|:-------------------------------|-------------|--------------|-------------|
| Correctness / GradleDependency | 0           | 1            | 0           |

## Usage
On your workflow file add:
```yaml
steps:
  - name: Run Gradle build
    run: ./gradlew build # this is an example
  - name: Report build results
    uses: gmazzo/publish-report-annotations@v1 # target latest major
    if: ${{ !cancelled() }}
```

### Configuration
| option              | usage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | default                                                          |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `token`             | The GitHub token to use to create a check (with `checks: write` permission).<br/><sub>Only required if `checkName` is also set</sub>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `${{ github.token }}`                                            |
| `checkName`         | The name of the check to create. <br/><sub>If not set, no check will be created and annotations will be reported to the workflow run</sub>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | None (reports to workflow run)                                   |
| `reports`           | A multiple line list of `glob`s pattern to look for reports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `**/build/test-results/**/*.xml`<br/>`**/build/reports/**/*.xml` |
| `testsSummary`      | The kind of summary to report for tests:<ul><li>`full`<br/>Reports all test suites with their test casses</li><li>`suitesOnly`<br/>Reports all test suites aggregating outcome of its tests casses, but without reporting the test cases itself</li><li>`totals`<br/>Reports aggregated totals of all suites</li><li>`off`<br/>Does not report any test to the summary</li></ul><br/>⚠️ Keep in mind on large builds, it may reach [the GitHub's limit](https://docs.github.com/en/rest/checks/runs?apiVersion=2022-11-28#create-a-check-run-output-object) on large builds. Try reducing the level of details if that's the case | `suitesOnly`                                                     |
| `checksSummary`     | The kind of summary to report into the checks<ul><li>`full`<br/>Reports all the checks, one table per check type</li><li>`off`<br/>Does not report any checks to the summary</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                            | `full`                                                           |
| `filterPassedTests` | To reduce verbosity (and summary size), skips tests (suites and cases) that has ✅ passed from reporting into the summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `false`                                                          |                                                         | `false` |
| `filterChecks`      | Reports only check's annotations coming from files that have been changed in the PR (does not affect to tests)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                                                          |
| `detectFlakyTests`  | Enables support for flaky tests detection (assumed the ones with the same `classname` and `name` are retries of the same test).<br/><br/>If at least once execution of them passes, then the overall outcome will considered passed. The suite will be reported as `flaky` as well and the last failure will annotated as a warning                                                                                                                                                                                                                                                                                               | `false`                                                          |
| `warningsAsErrors`  | If any warning is reported should count as an error. Mostly used in conjunction with `failOnError`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `false`                                                          |
| `failOnError`       | If the action should fail if any error is reported                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `false`                                                          |

### Outputs
The action will output the number of errors and warnings found in the reports, aggregated by `tests`, `checks` and totals:

| output   | description            | example                                                                                    |
|----------|------------------------|--------------------------------------------------------------------------------------------|
| `tests`  | The totals of `tests`  | <pre lang="json">{ "count": 8, "passed": 4, "errors": 0, "skipped": 2, "failed": 2 }</pre> |
| `checks` | The totals of `checks` | <pre lang="json">{ "count": 12, "errors": 6, "warnings": 4, "others": 2 }</json>           |
| `total`  | The aggregated totals  | <pre lang="json">{ "errors": 20, "warnings": 8, "others": 12 }</json>                      |
