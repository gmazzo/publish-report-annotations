import * as fs from "fs";

import { extractXcResultFile } from "./extractXcResultFile";

describe("extractXcResultFile", () => {
    test.each(["test-results.xcresult", "test-results-retry.xcresult"])(
        "xcrun produces json [%p]",
        async (xcresultsDir) => {
            const jsonFile = extractXcResultFile(`samples/${xcresultsDir}`);
            const actualJson = jsonFile
                ? JSON.parse(await fs.promises.readFile(jsonFile, { encoding: "utf-8" }))
                : null;

            expect(actualJson?.testNodes).toBeDefined();
        },
    );
});
