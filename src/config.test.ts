const getInput = jest.fn();
const getMultilineInput = jest.fn();
const getBooleanInput = jest.fn();

jest.mock('@actions/core', () => ({
    getInput,
    getMultilineInput,
    getBooleanInput,
}));

import {ConfigImpl} from "./config";

describe('config', () => {

    test.each([
        ['full', 'off'],
        ['suitesOnly', 'off'],
        ['totals', 'off'],
        ['<other>', 'off'],
        ['off', 'full'],
        ['off', 'totals'],
        ['off', '<other>']
    ])('can read config [testsSummaryInput=%p, checksSummaryInput=%p]', (testsSummaryInput, checksSummaryInput) => {
        getInput.mockImplementation((name: string) => {
            switch (name) {
                case 'summary': return '';
                case 'testsSummary': return testsSummaryInput;
                case 'checksSummary': return checksSummaryInput;
            }
            return `value:${name}`;
        });
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        const config = new ConfigImpl();

        if (testsSummaryInput == '<other>') {
            expect(() => config.testsSummary).toThrow(`Invalid value for 'testsSummary': <other>`);
            return;
        }
        if (checksSummaryInput == '<other>') {
            expect(() => config.checksSummary).toThrow(`Invalid value for 'checksSummary': <other>`);
            return;
        }

        expect(config.githubToken).toBe('value:token');
        expect(config.checkName).toBe('value:checkName');
        expect(config.testsSummary).toStrictEqual(testsSummaryInput);
        expect(config.checksSummary).toStrictEqual(checksSummaryInput);
        expect(config.reports).toBe('multiValue:reports');
        expect(config.filterPassedTests).toBe('bool:filterPassedTests');
        expect(config.filterChecks).toBe('bool:filterChecks');
        expect(config.warningsAsErrors).toBe('bool:warningsAsErrors');
        expect(config.failOnError).toBe('bool:failOnError');

        expect(getInput).toHaveBeenCalledWith('token', {required: true});
        expect(getInput).toHaveBeenCalledWith('checkName');
        expect(getInput).toHaveBeenCalledWith('testsSummary', {required: true});
        expect(getInput).toHaveBeenCalledWith('checksSummary', {required: true});
        expect(getMultilineInput).toHaveBeenCalledWith('reports', {required: true});
        expect(getBooleanInput).toHaveBeenCalledWith('filterPassedTests');
        expect(getBooleanInput).toHaveBeenCalledWith('filterChecks');
        expect(getBooleanInput).toHaveBeenCalledWith('detectFlakyTests');
        expect(getBooleanInput).toHaveBeenCalledWith('warningsAsErrors');
        expect(getBooleanInput).toHaveBeenCalledWith('failOnError');
        expect(getInput).toHaveBeenCalledTimes(5);
        expect(getMultilineInput).toHaveBeenCalledTimes(1);
        expect(getBooleanInput).toHaveBeenCalledTimes(5);
    });

    test.each([
        ['detailed', 'suitesOnly', 'full', undefined],
        ['detailedWithoutPassed', 'suitesOnly', 'full', true],
        ['totals', 'totals', 'totals', undefined],
        ['off', 'off', 'off', undefined],
        ['<other>', 'off', 'off', undefined],
    ])('when legacy summary is given, overrides new ones [summary=%p]', (summaryValue, expectedTestsSummary, expectedChecksSummary, expectedFilterPassedTests) => {
        getInput.mockImplementation((name: string) => name == 'summary' ? summaryValue : `value:${name}`);
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        const config = new ConfigImpl();

        if (summaryValue == '<other>') {
            expect(() => config.testsSummary).toThrow(`Invalid value for 'summary': <other>`);
            return;
        }

        expect(config.testsSummary).toStrictEqual(expectedTestsSummary);
        expect(config.checksSummary).toStrictEqual(expectedChecksSummary);
        expect(config.filterPassedTests).toBe(expectedFilterPassedTests || 'bool:filterPassedTests');

        expect(getInput).toHaveBeenCalledWith('token', {required: true});
        expect(getInput).toHaveBeenCalledWith('checkName');
        expect(getInput).toHaveBeenCalledWith('summary');
        expect(getInput).not.toHaveBeenCalledWith('testsSummary', expect.anything());
        expect(getInput).not.toHaveBeenCalledWith('checksSummary', expect.anything());
    });

});
