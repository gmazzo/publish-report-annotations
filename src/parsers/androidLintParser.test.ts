import {androidLintParser} from "./androidLintParser";

describe("androidLintParser", () => {

    test("given lint xml should obtain annotations", async () => {
        const data = await androidLintParser.parse("samples/lint-results-debug.xml");

        expect(data).toStrictEqual([
            {
                "endColumn": "5",
                "endLine": "14",
                "file": "sample-gradle/build.gradle.kts",
                "message": "A newer version of `compileSdkVersion` than 33 is available: 34\nThis detector looks for usages of libraries where the version you are using is not the current stable release. Using older versions is fine, and there are cases where you deliberately want to stick with an older version. However, you may simply not be aware that a more recent version is available, and that is what this lint check helps find.",
                "startColumn": "5",
                "startLine": "14",
                "title": "Correctness: Obsolete Gradle Dependency",
                "type": "warning"
            }
        ]);
    });

});
