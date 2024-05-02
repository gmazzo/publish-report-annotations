import {checkstyleParser} from "./checkstyleParser";

describe("checkstyleParser", () => {

    test("given detekt xml should obtain annotations", async () => {
        const data = await checkstyleParser.parse("samples/detekt-debug.xml");

        expect(data).toStrictEqual([
            {
                "endColumn": "11",
                "endLine": "3",
                "file": "sample-gradle/src/main/kotlin/org/test/sample/App.kt",
                "message": "The file src/main/kotlin/org/test/sample/App.kt is not ending with a new line.",
                "startColumn": "11",
                "startLine": "3",
                "title": "detekt.NewLineAtEndOfFile",
                "type": "warning"
            }
        ]);
    });

});
