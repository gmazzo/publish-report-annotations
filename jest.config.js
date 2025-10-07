/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "!**/*.it.test.ts"],
  testTimeout: 15000,
  clearMocks: true,
  reporters: ["default", ["jest-junit", { outputFile: "lib/jest-junit.xml" }]],
};
