import * as glob from "@actions/glob";
import * as core from "@actions/core";
import {isAbsolute, relative} from "path";
import process from "process";
import {existsSync} from "fs";

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

    const globber = await glob.create(paths.join('\n'));
    const {value: file} = await globber.globGenerator().next();
    if (file) {
        const relativePath = relative(process.cwd(), file);
        core.debug(`File \`${relativePath}\` found for \`${filepath}\` with possible extensions ${possibleExtensions.join(', ')}`);

        const location = relative(process.cwd(), file.substring(0, file.indexOf(filepath)));
        core.debug(`Adding to known locations: ${location}`);
        knownLocations.push(location);

        return relativePath;
    }
    if (core.isDebug()) {
        core.warning(`Could not find a file matching \`${filepath}\` with possible extensions ${possibleExtensions.join(', ')}`);
    }
    return filepath;
}
