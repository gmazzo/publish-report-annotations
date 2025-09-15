import { Config, ParseResults } from "./types";

declare global {
    interface String {
        truncate(limit: number): string;
    }
}

const ellipsis = new TextEncoder().encode("…");

String.prototype.truncate = function (limit: number): string {
    const bytes = new TextEncoder().encode(this.toString());

    if (bytes.length <= limit) {
        return this.toString();
    }

    const newBytes = bytes.slice(0, limit);
    for (let i = 0; i < ellipsis.length; i++) {
        newBytes[limit - ellipsis.length + i] = ellipsis[i];
    }
    return new TextDecoder("utf-8").decode(newBytes).replace("�", "");
};

export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? (Array.isArray(value) ? value : [value]) : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return joinSeparator("\n", ...values);
}

export function joinSeparator(separator: string, ...values: (string | null | undefined)[]): string {
    return values.filter((it) => it).join(separator);
}

export function shouldFail(results: ParseResults, config: Config) {
    return (config.failIfNoReportsFound && results.files.length == 0) || hasErrors(results, config);
}

export function hasErrors(results: ParseResults, config: Config) {
    return (
        results.tests.totals.failed > 0 ||
        results.checks.totals.errors > 0 ||
        (config.warningsAsErrors && results.checks.totals.warnings > 0)
    );
}
