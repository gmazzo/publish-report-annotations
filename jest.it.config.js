/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    ...require('./jest.config'),
    testMatch: ['**/*.it.test.ts'],
};
