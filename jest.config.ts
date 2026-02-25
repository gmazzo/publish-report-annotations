import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const presetConfig = createDefaultEsmPreset();

export default {
    ...presetConfig,
    testEnvironment: "node",
    testMatch: ["**/*.test.ts", "!**/*.it.test.ts"],
    testTimeout: 20000,
    clearMocks: true,
    reporters: ["default", ["jest-junit", { outputFile: "lib/jest-junit.xml" }]],
} satisfies Config;
