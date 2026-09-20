import { defineConfig } from "vitest/config";

const forIT = !!process.env.INTEGRATION_TESTS;

export default defineConfig({
    test: {
        environment: "node",
        include: forIT ? ["**/*.it.test.ts"] : ["**/*.test.ts"],
        exclude: forIT ? [] : ["**/*.it.test.ts"],
        testTimeout: 20000,
        clearMocks: true,
        coverage: {
            provider: "v8",
        },
        reporters: ["default", "junit"],
        outputFile: {
            junit: `lib/${forIT ? "vitest-it" : "vitest"}-junit.xml`,
        },
    },
});
