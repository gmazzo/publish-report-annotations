import {lstatSync, readFileSync} from "fs";
import {xml2js} from "xml-js";
import {extname} from "path";
import {extractXcResultFile} from "./extractXcResultFile";

export function readFile<Type>(filepath: string): (() => Type) | null {
    const extension = extname(filepath);
    const data = () => readFileSync(filepath, {encoding: "utf-8"});

    switch (extension) {
        case '.json':
        case '.sarif':
            return () => JSON.parse(data());

        case '.xml':
            return () => xml2js(data(), {compact: true, ignoreDeclaration: true}) as Type;

        case '.xcresult':
            if (lstatSync(filepath).isDirectory()) {
                const jsonFile = extractXcResultFile(filepath);

                if (jsonFile) {
                    return readFile(jsonFile)
                }
            }
    }
    return null
}
