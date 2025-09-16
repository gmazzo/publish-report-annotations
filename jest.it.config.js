/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require("./jest.config");

base.reporters.find((it) => it[0] === "jest-junit")[1].outputFile = "lib/jest-it-junit.xml";

module.exports = {
  ...base,
  testMatch: ["**/*.it.test.ts"],
  reporters: base.reporters.map((it) =>
    it[0] === "jest-junit" ? ["jest-junit", { outputFile: "lib/jest-it-junit.xml" }] : it,
  ),
};
