import { defineConfig } from "vitest/config";

const forIT = !!process.env.INTEGRATION_TESTS;
const include = forIT ? ["src/**/*.it.test.ts"] : ["src/**/*.test.ts"];
const exclude = forIT ? [] : ["src/**/*.it.test.ts"];

export default defineConfig({
    test: {
        environment: "node",
        include,
        exclude,
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
