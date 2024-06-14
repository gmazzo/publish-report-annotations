import {type components} from '@octokit/openapi-types';

const listFiles = jest.fn().mockResolvedValue([
    {filename: 'file1', status: 'added'},
    {filename: 'file2', status: 'removed'},
    {filename: 'file3', status: 'changed'},
    {filename: 'file4', status: 'added'},
    {filename: 'file5', status: 'modified'},
] as components['schemas']['diff-entry'][]);

const getOctokit = jest.fn().mockReturnValue({
    paginate: <P>(fn: (it: P) => P, params: P) => fn(params),
    rest: {
        pulls: {
            listFiles,
        },
    },
});

jest.mock('@actions/github', () => {
    return {
        getOctokit,
        context: {
            issue: {
                owner: 'anOwner',
                repo: 'aRepo',
                number: 101,
            },
        },
    };
});

jest.mock('./config', () => {
    return {
        githubToken: 'aToken',
    };
});

import {getPRFiles} from './getPRFiles';

describe('getPRFiles', () => {

    test('get without any statuses, returns all files', async () => {
        const files = await getPRFiles();

        expect(getOctokit).toHaveBeenCalledWith('aToken');
        expect(files).toEqual(['file1', 'file2', 'file3', 'file4', 'file5']);
    });

    test('get for added, returns just added files', async () => {
        const files = await getPRFiles('added');

        expect(getOctokit).toHaveBeenCalledWith('aToken');
        expect(files).toEqual(['file1', 'file4']);
    });

    test('get other statuses, returns the expected files', async () => {
        const files = await getPRFiles('changed', 'modified');

        expect(getOctokit).toHaveBeenCalledWith('aToken');
        expect(files).toEqual(['file3', 'file5']);
    });

});
