import {checkstyleParser} from "./checkstyleParser";
import {ParseResults} from "../types";

describe("checkstyleParser", () => {

    test("given detekt xml should obtain annotations", async () => {
        const data = await checkstyleParser.parse("samples/detekt-debug.xml");

        expect(data).toStrictEqual(new ParseResults({
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
                        name: "detekt",
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

});
