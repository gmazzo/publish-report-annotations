import { lstatSync, readFileSync } from "fs";
import { extname } from "path";
import { extractXcResultFile } from "./extractXcResultFile";
import { XMLParser } from "fast-xml-parser";
import bytes from "bytes";
import { Config } from "./types";

const XML = new XMLParser({
    ignoreDeclaration: true,
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
    attributesGroupName: "_attributes",
    textNodeName: "_text",
    trimValues: false,
    alwaysCreateTextNode: true,
    attributeValueProcessor: (_, value) => value.replace(/&#xA;/g, "\n"),
});

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
            return () => XML.parse(data(), false) as Type;

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
