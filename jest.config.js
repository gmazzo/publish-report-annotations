/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts', '!**/*.it.test.ts'],
    clearMocks: true,
    reporters: [
        "default",
        [ "jest-junit", { outputFile: 'lib/jest-junit.xml' } ],
    ],
};
