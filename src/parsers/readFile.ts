import * as fs from "fs";
import {xml2js} from "xml-js";

export async function readFile<Type>(filepath: string) {
    const extension = filepath.split('.').pop();
    const data = fs.promises.readFile(filepath, {encoding: "utf-8"});

    switch (extension) {
        case "sarif":
            return JSON.parse(await data) as Type;

        case "xml":
            return xml2js(await data, { compact: true, nativeType: true, ignoreDeclaration: true }) as Type;

        default:
            throw `Unsupported file type: ${extension || '<none>'}`;
    }
}
