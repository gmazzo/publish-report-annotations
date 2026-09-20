import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "tsup";

export async function bundlePackage(outDir = "dist") {
    await build({
        clean: true,
        entry: ["src/index.ts"],
        format: ["cjs"],
        minify: true,
        outDir,
        platform: "node",
        target: "node24.0",
    });

    finalizePackage(outDir);
}

export function finalizePackage(outDir = "dist") {
    const bundledFile = join(outDir, "index.cjs");
    const actionEntrypoint = join(outDir, "index.js");
    const runtimePackageJson = join(outDir, "package.json");

    if (!existsSync(bundledFile)) {
        throw new Error(`tsup did not emit ${basename(bundledFile)}`);
    }

    rmSync(actionEntrypoint, { force: true });
    renameSync(bundledFile, actionEntrypoint);
    writeFileSync(runtimePackageJson, JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
}

export function readDistPackageType(outDir = "dist") {
    return JSON.parse(readFileSync(join(outDir, "package.json"), "utf8")).type;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    await bundlePackage();
}
