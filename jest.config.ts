import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const forIT = !!process.env.INTEGRATION_TESTS;

export default {
    ...createDefaultEsmPreset(),
    testEnvironment: "node",
    testMatch: forIT ? ["**/*.it.test.ts"] : ["**/*.test.ts", "!**/*.it.test.ts"],
    testTimeout: 20000,
    clearMocks: true,
    reporters: ["default", ["jest-junit", { outputFile: `lib/jest-${forIT ? "-it" : ""}junit.xml` }]],
} satisfies Config;
