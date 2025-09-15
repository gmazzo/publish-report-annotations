import { lstatSync, readFileSync } from "fs";
import { xml2js } from "xml-js";
import { extname } from "path";
import { extractXcResultFile } from "./extractXcResultFile";
import bytes from "bytes";
import { Config } from "./types";

export function readFile<Type>(filepath: string, config: Config): (() => Type) | null {
    const extension = extname(filepath);
    const stat = lstatSync(filepath);

    const data = () => {
        if (stat.isFile() && stat.size > config.reportFileMaxSize) {
            throw new Error(
                `File '${filepath}' (${bytes(stat.size)}) exceeds the allowed maximum of ${bytes(config.reportFileMaxSize)}`,
            );
        }
        return readFileSync(filepath, { encoding: "utf-8" });
    };

    switch (extension) {
        case ".json":
        case ".sarif":
            return () => JSON.parse(data());

        case ".xml":
            return () => xml2js(data(), { compact: true, ignoreDeclaration: true }) as Type;

        case ".xcresult":
            if (stat.isDirectory()) {
                const jsonFile = extractXcResultFile(filepath);

                if (jsonFile) {
                    return readFile(jsonFile, config);
                }
            }
    }
    return null;
}
