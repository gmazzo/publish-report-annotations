import * as glob from "@actions/glob";
import * as core from "@actions/core";
import {isAbsolute, relative} from "path";
import {cwd} from "process";
import {existsSync} from "fs";
import {execSync} from "node:child_process";

const knownLocations: string[] = [];

export function resetCache() {
    knownLocations.length = 0;
}

export async function resolveFile(filepath: string, ...possibleExtensions: string[]) {
    if (isAbsolute(filepath) || existsSync(filepath)) {
        return filepath;
    }
    // tries to reuse previously resolved location
    if (knownLocations.length > 0) {
        for (const location of knownLocations) {
            if (possibleExtensions.length > 0) {
                for (const ext of possibleExtensions) {
                    const candidate = `${location}/${filepath}.${ext}`;

                    if (existsSync(candidate)) {
                        return candidate;
                    }
                }

            } else {
                const candidate = `${location}/${filepath}`;

                if (existsSync(candidate)) {
                    return candidate;
                }
            }
        }
    }

    const paths = possibleExtensions.length > 0 ?
        possibleExtensions.map(ext => `**/${filepath}.${ext}`) :
        [`**/${filepath}`];

    const file = await getFirstGitFile(paths);
    if (file) {
        const relativePath = relative(cwd(), file);
        core.debug(`File \`${relativePath}\` found for \`${filepath}\` with possible extensions ${possibleExtensions.join(', ')}`);

        const location = relative(process.cwd(), file.substring(0, file.indexOf(filepath)));
        if (!knownLocations.includes(location)) {
            core.debug(`Adding to known locations: ${location}`);
            knownLocations.push(location);
        }

        return relativePath;
    }
    if (core.isDebug()) {
        core.warning(`Could not find a file matching \`${filepath}\` with possible extensions ${possibleExtensions.join(', ')}`);
    }
    return filepath;
}

async function getFirstGitFile(paths: string[]) {
    const globber = await glob.create(paths.join('\n'));
    const generator = globber.globGenerator();

    let first: string | null = null;
    let moreResults = true;
    do {
        const {value: file, done} = await generator.next();

        if (file && isGitFile(file)) {
            return file;

        } else if (!first) {
            first = file || null;
        }
        moreResults = !done;
    } while (moreResults);
    return first;
}

function isGitFile(path: string) {
    try {
        execSync(`git ls-files --error-unmatch -- ${path}`, {stdio: 'ignore'});
        return true;

    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
}
