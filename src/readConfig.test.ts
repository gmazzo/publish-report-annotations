const getInput = jest.fn();
const getMultilineInput = jest.fn();
const getBooleanInput = jest.fn();
const createFileFilter = jest.fn().mockReturnValue('aFileFilter');
const getAppToken = jest.fn().mockReturnValue('anAppToken');

jest.mock('@actions/core', () => ({
    getInput,
    getMultilineInput,
    getBooleanInput,
}));

jest.mock("./createFileFilter", () => ({
    createFileFilter
}));

jest.mock("./githubApp", () => ({
    getAppToken
}));

import {readConfig} from "./readConfig";

describe('config', () => {

    test.each([
        ['full', 'off'],
        ['suitesOnly', 'off'],
        ['totals', 'off'],
        ['<other>', 'off'],
        ['off', 'full'],
        ['off', 'totals'],
        ['off', '<other>']
    ])('can read config [testsSummaryInput=%p, checksSummaryInput=%p]', async (testsSummaryInput, checksSummaryInput) => {
        getInput.mockImplementation((name: string) => {
            switch (name) {
                case 'appId': return '';
                case 'summary': return '';
                case 'testsSummary': return testsSummaryInput;
                case 'checksSummary': return checksSummaryInput;
            }
            return `value:${name}`;
        });
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        if (testsSummaryInput == '<other>') {
            await expect(readConfig()).rejects.toThrow(`Invalid value for 'testsSummary': <other>`);
            return;
        }
        if (checksSummaryInput == '<other>') {
            await expect(readConfig()).rejects.toThrow(`Invalid value for 'checksSummary': <other>`);
            return;
        }

        const config = await readConfig();
        expect(config.githubToken).toBe('value:token');
        expect(config.checkName).toBe('value:checkName');
        expect(config.testsSummary).toStrictEqual(testsSummaryInput);
        expect(config.checksSummary).toStrictEqual(checksSummaryInput);
        expect(config.reports).toBe('multiValue:reports');
        expect(config.filterPassedTests).toBe('bool:filterPassedTests');
        expect(config.filterChecks).toBe('bool:filterChecks');
        expect(config.warningsAsErrors).toBe('bool:warningsAsErrors');
        expect(config.failOnError).toBe('bool:failOnError');
        expect(config.prFilesFilter).toBe('aFileFilter');

        expect(getInput).toHaveBeenCalledWith('appId');
        expect(getInput).toHaveBeenCalledWith('token', {required: true});
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
        expect(getInput).toHaveBeenCalledTimes(6);
        expect(getMultilineInput).toHaveBeenCalledTimes(1);
        expect(getBooleanInput).toHaveBeenCalledTimes(5);
    });

    test('can resolve token',  async () => {
        getInput.mockImplementation((name: string) => {
            switch (name) {
                case 'appId': return 'anAppId';
                case 'appSecret': return 'anAppSecret';
            }
            return `off`;
        });

        const config = await readConfig();

        expect(getInput).toHaveBeenCalledWith('appId');
        expect(getInput).toHaveBeenCalledWith('appSecret', {required: true});
        expect(getInput).not.toHaveBeenCalledWith('token', expect.anything());
        expect(config.githubToken).toBe('anAppToken');
        expect(getAppToken).toHaveBeenCalledWith('anAppId', 'anAppSecret');
    });

    test.each([
        ['detailed', 'suitesOnly', 'full', undefined],
        ['detailedWithoutPassed', 'suitesOnly', 'full', true],
        ['totals', 'totals', 'totals', undefined],
        ['off', 'off', 'off', undefined],
        ['<other>', 'off', 'off', undefined],
    ])('when legacy summary is given, overrides new ones [summary=%p]', async (summaryValue, expectedTestsSummary, expectedChecksSummary, expectedFilterPassedTests) => {
        getInput.mockImplementation((name: string) => {
            switch (name) {
                case 'appId': return '';
                case 'summary': return summaryValue;
            }
            return `value:${name}`;
        });
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        if (summaryValue == '<other>') {
            await expect(readConfig()).rejects.toThrow(`Invalid value for 'summary': <other>`);
            return;
        }

        const config = await readConfig();

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
