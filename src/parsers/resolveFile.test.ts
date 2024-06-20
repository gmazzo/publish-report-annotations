import * as fs from "node:fs";
import * as glob from "@actions/glob";
import childProcess, {execSync} from "node:child_process";
import {resetCache, resolveFile} from "./resolveFile";
import {cwd} from "process";
import {dirname} from "path";

jest.spyOn(glob, 'create');
jest.spyOn(childProcess, 'execSync');

describe("resolveFile", () => {

    beforeEach(() => {
        resetCache();
    });

    test("when is absolute path, just returns itself", async () => {
        const resolvedPath = await resolveFile("/absolute/path/file.txt");

        expect(resolvedPath).toBe("/absolute/path/file.txt");
        expect(glob.create).not.toHaveBeenCalled();
    });

    test("when file exists, just returns itself", async () => {
        const resolvedPath = await resolveFile("sample-gradle/build.gradle.kts");

        expect(resolvedPath).toBe("sample-gradle/build.gradle.kts");
        expect(glob.create).not.toHaveBeenCalled();
    });

    test("when looking for a file, it returns a match", async () => {
        const resolvedPath = await resolveFile("org/test/sample/SampleTestSuite.kt");

        expect(resolvedPath).toBe("sample-gradle/src/test/kotlin/org/test/sample/SampleTestSuite.kt");
        expect(glob.create).toHaveBeenCalled();
    });

    test("when looking for a file with possible extensions, it returns a match", async () => {
        const resolvedPath = await resolveFile("org/test/sample/SampleTestSuite", 'java', 'kt', 'groovy');

        expect(resolvedPath).toBe("sample-gradle/src/test/kotlin/org/test/sample/SampleTestSuite.kt");
        expect(glob.create).toHaveBeenCalled();
    });

    test("when looking for a file but extension does not matches, it returns the same", async () => {
        const resolvedPath = await resolveFile("org/test/sample/SampleTestSuite", 'java', 'groovy');

        expect(resolvedPath).toBe("org/test/sample/SampleTestSuite");
        expect(glob.create).toHaveBeenCalled();
    });

    test("when location is found, it can be used without globbing again", async () => {
        const path1 = await resolveFile("org/test/sample/SampleTestSuite", 'java', 'kt', 'groovy');
        const path2 = await resolveFile("org/test/sample/AnotherTestSuite.kt");

        expect(path1).toBe("sample-gradle/src/test/kotlin/org/test/sample/SampleTestSuite.kt");
        expect(path2).toBe("sample-gradle/src/test/kotlin/org/test/sample/AnotherTestSuite.kt");
        expect(glob.create).toHaveBeenCalledTimes(1);
    });

    test(`if location is not in git, then it should keep looking`, async () => {
        const generatedFile = `${cwd()}/sample-gradle/build/generated/org/test/sample/SampleTestSuite.tmp`;
        fs.mkdirSync(dirname(generatedFile), {recursive: true});
        fs.writeFileSync(generatedFile, 'content');

        const resolvedPath = await resolveFile("org/test/sample/SampleTestSuite", 'tmp', 'kt', 'groovy');
        expect(resolvedPath).toBe("sample-gradle/src/test/kotlin/org/test/sample/SampleTestSuite.kt");

        expect(execSync).toHaveBeenCalledTimes(2);
        expect(execSync).toHaveBeenNthCalledWith(1, `git ls-files --error-unmatch -- ${generatedFile}`, {"stdio": "ignore"});
        expect(execSync).toHaveBeenNthCalledWith(2, `git ls-files --error-unmatch -- ${cwd()}/sample-gradle/src/test/kotlin/org/test/sample/SampleTestSuite.kt`, {"stdio": "ignore"});
    });

});
