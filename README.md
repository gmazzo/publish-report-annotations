![GitHub](https://img.shields.io/github/license/gmazzo/publish-report-annotations)
[![Latest](https://img.shields.io/github/v/release/gmazzo/publish-report-annotations)](https://github.com/gmazzo/publish-report-annotations/releases/latest)
[![Build Status](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml/badge.svg)](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml)
[![codecov](https://codecov.io/gh/gmazzo/publish-report-annotations/branch/master/graph/badge.svg)](https://codecov.io/gh/gmazzo/publish-report-annotations)
[![Users](https://img.shields.io/badge/users_by-Sourcegraph-purple)](https://sourcegraph.com/search?q=content:gmazzo/publish-report-annotations%40+-repo:github.com/gmazzo/publish-report-annotations)

# publish-report-annotations
Reports JUnit, Android Lint, Detekt and any other CheckStyle compatible XML reports as GitHub Actions annotations.
Mostly targeting Gradle builds

#### JUnit's reports
![junit](https://github.com/gmazzo/publish-report-annotations/assets/513566/63fd2a86-2585-4c49-bb79-9b9dc88007fd)

#### Checkstyle (and compatibles, like Detekt)s reports
![checkstyle/detekt](https://github.com/gmazzo/publish-report-annotations/assets/513566/10979561-f1d3-48ef-a168-d416d866f2cc)

#### Android Lint's reports
![android lint](https://github.com/gmazzo/publish-report-annotations/assets/513566/cedf8726-0633-43d4-ae6a-3371362f3e8c)

#### Detailed logs
![logs](https://github.com/gmazzo/publish-report-annotations/assets/513566/4d2a3224-c326-4948-bf58-6aec18715818)

## Usage
On your workflow file add:
```yaml
steps:
  - name: Run Gradle build
    run: ./gradlew build # this is an example
  - name: Report build results
    uses: gmazzo/publish-report-annotations@v1 # target latest version
```

### Configuration
| option             | usage                                                                                                                                      | default                                                                                                                                                     |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `token`            | The GitHub token to use to create a check (with `checks: write` permission).<br/><sub>Only required if `checkName` is also set</sub>       | `github.token`                                                                                                                                              |
| `checkName`        | The name of the check to create. <br/><sub>If not set, no check will be created and annotations will be reported to the workflow run</sub> | None (reports to workflow run)                                                                                                                              |
| `reports`          | A multiple line list of `glob`s pattern to look for reports                                                                                | `**/build/test-results/**/TEST-*.xml`<br/>`**/build/reports/checkstyle/*.xml`<br/>`**/build/reports/lint-results-*.xml`<br/>`**/build/reports/detekt/*.xml` |
| `warningsAsErrors` | If any warning is reported should count as an error. Mostly used in conjunction with `failOnError`                                         | `false`                                                                                                                                                     |
| `failOnError`      | If the action should fail if any error is reported                                                                                         | `false`                                                                                                                                                     |

### Outputs
The action will output the number of errors and warnings found in the reports, aggregated by `tests`, `checks` and totals:

| output   | description            | example                                                     |
|----------|------------------------|-------------------------------------------------------------|
| `tests`  | The totals of `tests`  | `{ tests: 8, passed: 4, errors: 0, skipped: 2, failed: 2 }` |
| `checks` | The totals of `checks` | `{ checks: 8, errors: 0, warnings: 2 }`                     |
| `total`  | The aggregated totals  | `{ errors: 0, warnings: 2, others: 12 }`                    |
