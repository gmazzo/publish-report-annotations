import * as fs from "fs";
import {parseStringPromise} from "xml2js";

export async function readFile<Type>(filepath: string) {
    const extension = filepath.split('.').pop();
    const data = fs.promises.readFile(filepath, {encoding: "utf-8"});

    switch (extension) {
        case "sarif":
            return JSON.parse(await data) as Type;

        case "xml":
            return parseStringPromise(await data, {
                attrkey: '_attrs',
                charkey: '_text',
                emptyTag: () => true,
                explicitArray: false,
            }) as Type;

        default:
            throw `Unsupported file type: ${extension || '<none>'}`;
    }
}
