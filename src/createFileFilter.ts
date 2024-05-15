import {relative} from "path";
import * as core from "@actions/core";
import {getPRFiles} from "./getPRFiles";
import {FileFilter} from "./parsers/parser";

export async function createFileFilter(): Promise<FileFilter> {
    const prFiles = await getPRFiles();

    return (file?: string) => {
        if (file && prFiles) {
            const relativePath = relative(process.cwd(), file);

            if (!prFiles.includes(relativePath)) {
                core.debug(`Skipping annotation for file: ${relativePath}`);
                return false;
            }
        }
        return true;
    };
}