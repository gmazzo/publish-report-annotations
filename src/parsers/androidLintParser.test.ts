import {androidLintParser} from "./androidLintParser";
import {ParseResults} from "../types";

describe("androidLintParser", () => {

    test("given lint xml should obtain annotations", async () => {
        const data = await androidLintParser.parse("samples/lint-results-debug.xml");

        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                    endColumn: 5,
                    endLine: 14,
                    file: "sample-gradle/build.gradle.kts",
                    message: "A newer version of `compileSdkVersion` than 33 is available: 34",
                    rawDetails: "This detector looks for usages of libraries where the version you are using is not the current stable release. Using older versions is fine, and there are cases where you deliberately want to stick with an older version. However, you may simply not be aware that a more recent version is available, and that is what this lint check helps find.",
                    startColumn: 5,
                    startLine: 14,
                    title: "Correctness: Obsolete Gradle Dependency",
                    severity: "warning"
                }
            ],
            checks: {
                checks: [
                    {
                        name: "Android Lint",
                        errors: 0,
                        others: 0,
                        warnings: 1,
                        issues: { 'Correctness / GradleDependency': { severity: 'warning', count: 1 } }
                    }
                ],
                totals: {
                    count: 1,
                    errors: 0,
                    others: 0,
                    warnings: 1
                }
            },
            totals: {
                errors: 0,
                warnings: 1,
                others: 0
            }
        }));
    });

});
