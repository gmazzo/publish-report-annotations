import {androidLintParser} from "./androidLintParser";
import {ParseResults} from "../types";

const fileFilter = jest.fn().mockReturnValue(true);

describe("androidLintParser", () => {

    test("given lint xml should obtain annotations", async () => {
        const data = await androidLintParser.parse("samples/lint-results-debug.xml", fileFilter);

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
                },
                {
                    endColumn: 27,
                    endLine: 9,
                    file: "src/main/res/drawable/ic_icon.xml",
                    message: "Very long vector path (1444 characters), which is bad for performance. Considering reducing precision, removing minor details or rasterizing vector.",
                    rawDetails: "Using long vector paths is bad for performance. There are several ways to make the `pathData` shorter:\n* Using less precision\n* Removing some minor details\n* Using the Android Studio vector conversion tool\n* Rasterizing the image (converting to PNG)",
                    severity: "warning",
                    startColumn: 27,
                    startLine: 9,
                    title: "Performance: Long vector paths"
                },
                {
                    endColumn: 86,
                    endLine: 2,
                    file: "src/main/res/drawable/ic_icon.xml",
                    message: "Very long vector path (1415 characters), which is bad for performance. Considering reducing precision, removing minor details or rasterizing vector.",
                    rawDetails: "Using long vector paths is bad for performance. There are several ways to make the `pathData` shorter:\n* Using less precision\n* Removing some minor details\n* Using the Android Studio vector conversion tool\n* Rasterizing the image (converting to PNG)",
                    severity: "warning",
                    startColumn: 86,
                    startLine: 2,
                    title: "Performance: Long vector paths"
                }
            ],
            checks: {
                checks: [
                    {
                        name: "Android Lint",
                        errors: 0,
                        others: 0,
                        warnings: 3,
                        issues: {
                            'Correctness / GradleDependency': { count: 1, severity: 'warning' },
                            'Performance / VectorPath': { count: 2, severity: "warning" }}
                    }
                ],
                totals: {
                    count: 1,
                    errors: 0,
                    others: 0,
                    warnings: 3
                }
            },
            totals: {
                errors: 0,
                warnings: 3,
                others: 0
            }
        }));
    });

    test("given lint xml, but filtering, expect no annotations", async () => {
        fileFilter.mockReturnValue(false);

        const data = await androidLintParser.parse("samples/lint-results-debug.xml", fileFilter);

        expect(fileFilter).toHaveBeenCalledWith("sample-gradle/build.gradle.kts");
        expect(data).toStrictEqual(new ParseResults({}));
    });

});
