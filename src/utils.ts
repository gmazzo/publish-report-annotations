import ParsedAnnotations from "./ParsedAnnotations";

export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return values.filter(it => it).join('\n');
}

export function summaryOf(annotations: ParsedAnnotations | ParsedAnnotations['totals']) {
    const totals = annotations instanceof ParsedAnnotations ? annotations.totals : annotations;
    return `${totals.errors} error${totals.errors != 1 ? 's' : ''}, ${totals.warnings} warning${totals.warnings != 1 ? 's' : ''} and ${totals.notices} notice${totals.notices != 1 ? 's' : ''}`;
}

export function shouldFail(annotations: ParsedAnnotations | ParsedAnnotations['totals'], warningsAsErrors: boolean) {
    const totals = annotations instanceof ParsedAnnotations ? annotations.totals : annotations;
    return totals.errors > 0 || (warningsAsErrors && totals.warnings > 0);
}
