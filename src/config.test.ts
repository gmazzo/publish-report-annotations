const getInput = jest.fn();
const getMultilineInput = jest.fn();
const getBooleanInput = jest.fn();
const warning = jest.fn();

jest.mock('@actions/core', () => ({
    getInput,
    getMultilineInput,
    getBooleanInput,
    warning
}));

import {ConfigImpl} from "./config";

describe('config', () => {

    test.each([
        ['testSuites\ntestCases', {tests: {suites: true, cases: true, skipPassed: false}, checks: false}],
        ['testCases checks', {tests: {suites: false, cases: true, skipPassed: false}, checks: true}],
        ['testSuites,skipPassed|checks', {tests: {suites: true, cases: false, skipPassed: true}, checks: true}],
        ['detailed', {tests: {suites: true, cases: false, skipPassed: false}, checks: true}],
        ['detailedWithoutPassed', {tests: {suites: true, cases: false, skipPassed: true}, checks: true}],
        ['totals', {tests: {suites: false, cases: false, skipPassed: false}, checks: true}],
        ['off', false],
        ['other', {}]
    ])('can read config [summary=%p]', (summaryInput, expectedSummaryValue) => {
        getInput.mockImplementation((name: string) => name == 'summary' ? summaryInput : `value:${name}`);
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        const config = new ConfigImpl();

        if (summaryInput == 'other') {
            expect(() => config.summary).toThrow(`Invalid summary flag: 'other'`);
            return;
        }

        expect(config.githubToken).toBe('value:token');
        expect(config.checkName).toBe('value:checkName');
        expect(config.summary).toStrictEqual(expectedSummaryValue);
        expect(config.reports).toBe('multiValue:reports');
        expect(config.filterChecks).toBe('bool:filterChecks');
        expect(config.warningsAsErrors).toBe('bool:warningsAsErrors');
        expect(config.failOnError).toBe('bool:failOnError');

        expect(getInput).toHaveBeenCalledWith('token', {required: true});
        expect(getInput).toHaveBeenCalledWith('checkName');
        expect(getInput).toHaveBeenCalledWith('summary', {required: true});
        expect(getMultilineInput).toHaveBeenCalledWith('reports', {required: true});
        expect(getBooleanInput).toHaveBeenCalledWith('filterChecks');
        expect(getBooleanInput).toHaveBeenCalledWith('detectFlakyTests');
        expect(getBooleanInput).toHaveBeenCalledWith('warningsAsErrors');
        expect(getBooleanInput).toHaveBeenCalledWith('failOnError');
        expect(getInput).toHaveBeenCalledTimes(3);
        expect(getMultilineInput).toHaveBeenCalledTimes(1);
        expect(getBooleanInput).toHaveBeenCalledTimes(4);

        if (summaryInput == 'detailed' || summaryInput == 'detailedWithoutPassed' || summaryInput == 'totals') {
            expect(warning).toHaveBeenCalledWith(`The summary flag '${summaryInput}' is deprecated and will be removed in a future version. Please use 'testSuites', 'testCases', 'skipPassed', 'checks' or 'off' instead.`);
        } else {
            expect(warning).not.toHaveBeenCalled();
        }
    });

});
