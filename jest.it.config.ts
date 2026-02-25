import { Config } from "jest";

import base from "./jest.config";

export default {
    ...base,
    testMatch: ["**/*.it.test.ts"],
    reporters: base.reporters.map((it) =>
        it[0] === "jest-junit" ? ["jest-junit", { outputFile: "lib/jest-it-junit.xml" }] : it,
    ),
} satisfies Config;
