import * as fs from "fs";
import {parseString, parseStringPromise} from "xml2js";

export async function readFile(filepath: string) {
    const extension = filepath.split('.').pop()
    const data = fs.promises.readFile(filepath, {encoding: "utf-8"})

    switch (extension) {
        case "sarif":
            return JSON.parse(await data)

        case "xml":
            return parseStringPromise(await data, {
                attrkey: '_attrs',
                charkey: '_text',
                emptyTag: () => true,
                explicitArray: false,
            })

        default:
            throw `Unsupported file type: ${extension}`
    }
}
