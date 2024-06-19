const getPRFiles = jest.fn().mockReturnValue(['file1', 'file2']);
const coreDebug = jest.fn();

jest.mock('./getPRFiles', () => ({
    getPRFiles
}));

jest.mock('@actions/core', () => ({
    debug: coreDebug
}));

import {createFileFilter} from "./createFileFilter";

describe('fileFilter', () => {

    test('should return true, for files in the PR', async () => {
        const fileFilter = await createFileFilter('aToken');

        expect(typeof fileFilter).toBe('function');
        expect(fileFilter('file1')).toBe(true);
        expect(fileFilter('file2')).toBe(true);
        expect(coreDebug).not.toHaveBeenCalled();
    });

    test('should return false and log, for files not in the PR', async () => {
        const fileFilter = await createFileFilter('aToken');

        expect(typeof fileFilter).toBe('function');
        expect(fileFilter('file3')).toBe(false);
        expect(coreDebug).toHaveBeenCalledWith('Skipping annotation for file: file3');
    });

    test('if file is missing, it should not be filtered', async () => {
        const fileFilter = await createFileFilter('aToken');

        expect(typeof fileFilter).toBe('function');
        expect(fileFilter(undefined)).toBe(true);
        expect(coreDebug).not.toHaveBeenCalled();
    });

});
