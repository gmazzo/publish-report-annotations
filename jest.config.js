/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "!**/*.it.test.ts"],
  clearMocks: true,
  testTimeout: 15000,
  reporters: ["default", ["jest-junit", { outputFile: "lib/jest-junit.xml" }]],
};
