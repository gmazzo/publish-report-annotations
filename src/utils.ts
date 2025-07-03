import {Config, ParseResults} from "./types";

export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return joinSeparator('\n', ...values);
}

export function joinSeparator(separator: string, ...values: (string | null | undefined)[]): string {
    return values.filter(it => it).join(separator);
}

export function shouldFail(results: ParseResults, config: Config) {
    return (config.failIfNoReportsFound && results.files.length == 0) || hasErrors(results, config);
}

export function hasErrors(results: ParseResults, config: Config) {
    return results.totals.errors > 0 || (config.warningsAsErrors && results.totals.warnings > 0);
}
