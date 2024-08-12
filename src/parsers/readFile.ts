import * as fs from "fs";
import {xml2js} from "xml-js";

export async function readFile<Type>(filepath: string) {
    const extension = filepath.split('.').pop();
    const data = fs.promises.readFile(filepath, {encoding: "utf-8"});

    switch (extension) {
        case "sarif":
            return JSON.parse(await data) as Type;

        case "xml":
            return xml2js(await data, {compact: true, ignoreDeclaration: true}) as Type;

        default:
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw `Unsupported file type: ${extension || '<none>'}`;
    }
}
