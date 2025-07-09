import {Config, ParseResults} from "../types";
import {readFile} from "../readFile";

const prFilesFilter = jest.fn().mockReturnValue(true);
const config = { prFilesFilter } as unknown as Config;

import {checkstyleParser, CheckStyleData} from "./checkstyleParser";

describe("checkstyleParser", () => {

    test("given detekt xml should obtain annotations", async () => {
        const data = readFile<CheckStyleData>("samples/detekt-debug.xml")!;
        const results = await checkstyleParser.process(data(), config);

        expect(prFilesFilter).toHaveBeenCalledWith("sample-gradle/src/main/kotlin/org/test/sample/App.kt");
        expect(results).toStrictEqual(new ParseResults({
            annotations: [
                {
                    endColumn: 11,
                    endLine: 3,
                    file: "sample-gradle/src/main/kotlin/org/test/sample/App.kt",
                    message: "The file src/main/kotlin/org/test/sample/App.kt is not ending with a new line.",
                    startColumn: 11,
                    startLine: 3,
                    title: "detekt.NewLineAtEndOfFile",
                    severity: "warning"
                }
            ],
            checks: {
                checks: [
                    {
                        name: "Detekt",
                        errors: 0,
                        warnings: 1,
                        others: 0,
                        issues: { 'NewLineAtEndOfFile': { severity: 'warning', count: 1 } }
                    }
                ],
                totals: {
                    count: 1,
                    errors: 0,
                    warnings: 1,
                    others: 0
                }
            },
            totals: {
                errors: 0,
                warnings: 1,
                others: 0
            },
        }));
    });

    test("given detekt xml, but filtering, expect no annotations", async () => {
        prFilesFilter.mockReturnValue(false);

        const data = readFile<CheckStyleData>("samples/detekt-debug.xml")!;
        const results = await checkstyleParser.process(data(), config);

        expect(prFilesFilter).toHaveBeenCalledWith("sample-gradle/src/main/kotlin/org/test/sample/App.kt");
        expect(results).toStrictEqual(new ParseResults({}));
    });

});
