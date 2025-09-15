import { lstatSync, readFileSync } from "fs";
import { xml2js } from "xml-js";
import { extname } from "path";
import { extractXcResultFile } from "./extractXcResultFile";
import * as core from "@actions/core";
import bytes from "bytes";
import { Config } from "./types";

export function readFile<Type>(filepath: string, config: Config): (() => Type) | null {
    const extension = extname(filepath);
    const data = () => readFileSync(filepath, { encoding: "utf-8" });
    const stat = lstatSync(filepath);

    if (stat.isFile() && stat.size > config.reportFileMaxSize) {
        const message = `File '${filepath}' (${bytes(stat.size)}) exceeds the allowed maximum of ${bytes(config.reportFileMaxSize)}`;
        switch (config.reportFileExceedSizeAction) {
            case "fail":
                throw new Error(message);
            case "error":
                core.error(message);
                return null;
            case "warning":
                core.warning(message);
                return null;
            case "notice":
                core.notice(message);
                return null;
            case "ignore":
                core.debug(message);
                return null;
        }
    }

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
