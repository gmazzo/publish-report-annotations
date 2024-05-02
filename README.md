![GitHub](https://img.shields.io/github/license/gmazzo/publish-report-annotations)
![Latest](https://img.shields.io/github/v/release/gmazzo/publish-report-annotations)
[![Build Status](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml/badge.svg)](https://github.com/gmazzo/publish-report-annotations/actions/workflows/build.yaml)
[![codecov](https://codecov.io/gh/gmazzo/publish-report-annotations/branch/master/graph/badge.svg)](https://codecov.io/gh/gmazzo/publish-report-annotations)
[![Users](https://img.shields.io/badge/users_by-Sourcegraph-purple)](https://sourcegraph.com/search?q=content:gmazzo/publish-report-annotations%40+-repo:github.com/gmazzo/publish-report-annotations)

# publish-report-annotations
Reports JUnit, Android Lint, Detekt and any other CheckStyle compatible XML reports as GitHub Actions annotations.
Mostly targeting Gradle builds

## Usage
On your workflow file add:
```yaml
steps:
  - name: Run Gradle build
    run: ./gradlew build # this is an example
  - name: Report build results
    uses: gmazzo/publish-report-annotations@main # target latest version
```
