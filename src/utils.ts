import {ParseResults} from "./types";

export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return values.filter(it => it).join('\n');
}

export function summaryOf(totals: ParseResults['totals']) {
    return `${totals.errors} error${totals.errors != 1 ? 's' : ''}, ${totals.warnings} warning${totals.warnings != 1 ? 's' : ''} and ${totals.others} other${totals.others != 1 ? 's' : ''}`;
}

export function shouldFail(totals: ParseResults['totals'], warningsAsErrors: boolean) {
    return totals.errors > 0 || (warningsAsErrors && totals.warnings > 0);
}
