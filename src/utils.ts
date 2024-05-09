import {ParseResults} from "./types";

export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return values.filter(it => it).join('\n');
}

function summaryEntry(name: string, amount: number) {
    return `${amount} ${name}${amount != 1 ? 's' : ''}`;
}

function summaryOfTests(totals: ParseResults['tests']['totals']) {
    let summary = summaryEntry("test", totals.count);
    if (totals.count == totals.passed) {
        return summary + ` passed`;

    } else {
        if (totals.passed > 0) summary += `, ${totals.passed} passed`;
        if (totals.skipped > 0) summary += `, ${totals.skipped} skipped`;
        if (totals.failed > 0) summary += `, ${totals.failed} failed`;
        if (totals.errors > 0) summary += `, ${summaryEntry("error", totals.errors)}`;
    }
    return summary;
}

function summaryOfChecks(checks: ParseResults['checks']['totals']) {
    let summary = '';
    if (checks.errors > 0) summary += summaryEntry("error", checks.errors);
    if (checks.warnings > 0) {
        if (summary) summary += ', ';
        summary += summaryEntry("warning", checks.warnings);
    }
    if (checks.others > 0) {
        if (summary) summary += ', ';
        summary += summaryEntry("other", checks.others);
    }
    return summary;
}

export function summaryOf(results: ParseResults) {
    let summary = '';
    if (results.tests.totals.count > 0) summary = summaryOfTests(results.tests.totals);
    if (results.checks.totals.count > 0) {
        if (summary) summary += ', checks: ';
        summary += summaryOfChecks(results.checks.totals);
    }
    return summary;
}

export function shouldFail(totals: ParseResults['totals'], warningsAsErrors: boolean) {
    return totals.errors > 0 || (warningsAsErrors && totals.warnings > 0);
}
