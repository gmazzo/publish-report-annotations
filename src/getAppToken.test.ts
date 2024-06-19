const request = jest.fn().mockResolvedValue({data: {id: 'anInstallationId'}});
const auth = jest.fn().mockResolvedValue({token: 'anInstallationToken'});
const getInstallationOctokit = jest.fn().mockResolvedValue({auth});
const App = jest.fn().mockImplementation(() => ({
    octokit: {request},
    getInstallationOctokit
}));
const setSecret = jest.fn();

jest.mock('../node_modules/@octokit/app', () => ({
    App
}));

jest.mock('@actions/github', () => ({
    context: {
        repo: {
            owner: 'anOwner',
            repo: 'aRepo'
        }
    }
}));

jest.mock('@actions/core', () => ({
    setSecret
}));

import {getAppToken} from "./getAppToken";

describe('getAppToken', () => {

    test('given an github app, should retrieve an installation token', async () => {
        const token = await getAppToken('anAppId', 'anAppSecret');

        expect(App).toHaveBeenCalledWith({appId: 'anAppId', privateKey: 'anAppSecret'});
        expect(request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/installation', {owner: 'anOwner', repo: 'aRepo'});
        expect(getInstallationOctokit).toHaveBeenCalledWith('anInstallationId');
        expect(auth).toHaveBeenCalledWith({type: 'installation'});
        expect(token).toEqual('anInstallationToken');
        expect(setSecret).toHaveBeenCalledWith('anInstallationToken');
    });

});
