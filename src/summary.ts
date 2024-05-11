import {ParseResults} from "./types";

function entry(amount: number, name: string) {
    return `${amount} ${name}${amount != 1 ? 's' : ''}`;
}

function summaryOfTests(totals: ParseResults['tests']['totals']) {
    let summary = entry(totals.count, "test");
    if (totals.count == totals.passed) {
        return summary + ` passed`;

    } else {
        if (totals.passed > 0) summary += `, ${totals.passed} passed`;
        if (totals.skipped > 0) summary += `, ${totals.skipped} skipped`;
        if (totals.failed > 0) summary += `, ${totals.failed} failed`;
        if (totals.errors > 0) summary += `, ${entry(totals.errors, "error")}`;
    }
    return summary;
}

function summaryOfChecks(checks: ParseResults['checks']['totals']) {
    let summary = '';
    if (checks.errors > 0) summary += entry(checks.errors, "error");
    if (checks.warnings > 0) {
        if (summary) summary += ', ';
        summary += entry(checks.warnings, "warning");
    }
    if (checks.others > 0) {
        if (summary) summary += ', ';
        summary += entry(checks.others, "other");
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

function summaryTableOfTests(tests: ParseResults['tests']) {
    let table = `|Tests|✅ ${tests.totals.passed} passed|🟡 ${tests.totals.skipped} skipped|❌ ${tests.totals.failed + tests.totals.errors} failed|⌛ took\n`;
    table += `|:-|-|-|-|-|\n`;
    for (const suite of tests.suites) {
        table += `|${suite.failed + suite.errors > 0 ? '❌' : suite.skipped > 0 ? '🟡' : '✅'} ${suite.name}|${suite.passed}|${suite.skipped}|${suite.failed + suite.errors}|${suite.took}s\n`;
    }
    return table;
}

function summaryTableOfChecks(checks: ParseResults['checks']) {
    let table = `|Checks|🛑 ${entry(checks.totals.errors, 'error')}|⚠️ ${entry(checks.totals.warnings, 'warning')}|💡 ${entry(checks.totals.others, 'other')}\n`;
    table += `|:-|-|-|-|\n`;
    for (const check of checks.checks) {
        table += `${check.name}|${check.errors}|${check.warnings}|${check.others}\n`;
    }
    return table;
}

export function summaryTableOf(results: ParseResults) {
    let table = '';
    if (results.tests.totals.count > 0) {
        table += summaryTableOfTests(results.tests);
    }
    if (results.checks.totals.count > 0) {
        if (table) table += '\n';
        table += summaryTableOfChecks(results.checks);
    }
    return table;
}
