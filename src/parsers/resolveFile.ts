import * as glob from "@actions/glob";
import * as core from "@actions/core";
import {isAbsolute, relative} from "path";
import process from "process";
import {existsSync} from "node:fs";

export async function resolveFile(filepath: string, ...possibleExtensions: string[]) {
    if (isAbsolute(filepath) || existsSync(filepath)) {
        return filepath
    }

    const paths = possibleExtensions.length > 0 ?
        possibleExtensions.map(ext => `${filepath}.${ext}`) :
        [filepath]

    const globber = await glob.create(paths.join('\n'));
    const {value: file} = await globber.globGenerator().next()
    if (file) {
        const relativePath = relative(process.cwd(), file);
        core.debug(`File \`${relativePath}\` found for \`${filepath}\` with possible extensions ${possibleExtensions}`);
        return relativePath
    }
    if (core.isDebug()) {
        core.warning(`Could not find a file matching \`${filepath}\` with possible extensions ${possibleExtensions}`);
    }
    return filepath
}
