import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, test } from "vitest";
// @ts-expect-error plain ESM build script used only in tests
import { finalizePackage, readDistPackageType } from "../scripts/package.mjs";

const tempDirs: string[] = [];

afterEach(() => {
    for (const tempDir of tempDirs.splice(0)) {
        fs.rmSync(tempDir, { force: true, recursive: true });
    }
});

describe("package script", () => {
    test("replaces the action entrypoint and writes a commonjs package.json", () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "package-script-"));
        tempDirs.push(tempDir);
        fs.writeFileSync(path.join(tempDir, "index.cjs"), "module.exports = {};\n");
        fs.writeFileSync(path.join(tempDir, "index.js"), "stale entrypoint\n");

        finalizePackage(tempDir);

        expect(fs.readFileSync(path.join(tempDir, "index.js"), "utf8")).toBe("module.exports = {};\n");
        expect(fs.existsSync(path.join(tempDir, "index.cjs"))).toBe(false);
        expect(readDistPackageType(tempDir)).toBe("commonjs");
    });

    test("fails when tsup does not emit the expected bundle", () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "package-script-"));
        tempDirs.push(tempDir);

        expect(() => finalizePackage(tempDir)).toThrow("tsup did not emit index.cjs");
    });
});
