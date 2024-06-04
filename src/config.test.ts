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

    test.each([['detailed'], ['detailedWithoutPassed'], ['totals'], ['off'], ['other']])('can read config [summary=%p]',  (summaryValue) => {
        getInput.mockImplementation((name: string) => name == 'summary' ? summaryValue : `value:${name}`);
        getMultilineInput.mockImplementation((name: string) => `multiValue:${name}`);
        getBooleanInput.mockImplementation((name: string) => `bool:${name}`);

        const config = new ConfigImpl();

        if (summaryValue == 'other') {
            expect(() => config.summary).toThrow(`Invalid summary value: ${summaryValue}`);
            return;
        }

        expect(config.githubToken).toBe('value:token');
        expect(config.checkName).toBe('value:checkName');
        expect(config.summary).toBe(summaryValue);
        expect(config.reports).toBe('multiValue:reports');
        expect(config.filterChecks).toBe('bool:filterChecks');
        expect(config.warningsAsErrors).toBe('bool:warningsAsErrors');
        expect(config.failOnError).toBe('bool:failOnError');

        expect(getInput).toHaveBeenCalledWith('token', {required: true});
        expect(getInput).toHaveBeenCalledWith('checkName');
        expect(getInput).toHaveBeenCalledWith('summary', {required: true});
        expect(getMultilineInput).toHaveBeenCalledWith('reports', {required: true});
        expect(getBooleanInput).toHaveBeenCalledWith('filterChecks');
        expect(getBooleanInput).toHaveBeenCalledWith('warningsAsErrors');
        expect(getBooleanInput).toHaveBeenCalledWith('failOnError');
    });

});
