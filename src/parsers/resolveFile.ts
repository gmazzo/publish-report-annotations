import * as glob from "@actions/glob";
import * as core from "@actions/core";
import {relative} from "path";
import process from "process";

export async function resolveFile(filepath: string, ...possibleExtensions: string[]) {
    const paths =
        possibleExtensions.length == 0 ? [filepath] :
        possibleExtensions.map(ext => `${filepath}.${ext}`)

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
