import path from "path";
import {spawnSync} from "child_process";
import {join} from "./utils";
import * as core from "@actions/core";
import {openSync, closeSync} from "fs";

export function extractXcResultFile(filePath: string) {
    const jsonFile = path.resolve(filePath, "results.json");
    const outStream = openSync(jsonFile, 'w');

    try {
        const result = spawnSync("xcrun", ["xcresulttool", "get", "test-results", "tests", "--path", filePath], {
            encoding: "utf8",
            stdio: ['inherit', outStream, 'ignore']
        });
        if (result.error || result.stderr || result.status !== 0) {
            core.warning(
                `Failed to extract XCResults json file: ${join(result.error?.message, result.stderr)} (Exit code: ${result.status})`,
            );
            return null;
        }
        return jsonFile;

    } finally {
        closeSync(outStream);
    }
}
