import { relative } from "path";
import { getPRFiles } from "./getPRFiles";
import { FileFilter } from "./parsers/parser";

export async function createFileFilter(githubToken: string): Promise<FileFilter> {
    const prFiles = await getPRFiles(githubToken);

    return (file?: string) => {
        if (file && prFiles) {
            const relativePath = relative(process.cwd(), file);

            return prFiles.includes(relativePath);
        }
        return true;
    };
}
