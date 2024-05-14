import {ParseResults} from "./types";
import {summary} from "./config";

function entry(amount: number, name: string) {
    return `${amount} ${name}${amount != 1 ? 's' : ''}`;
}

function summaryOfTests(totals: ParseResults['tests']['totals'], withIcons = false) {
    let summary = entry(totals.count, "test");
    if (totals.count == totals.passed) {
        return summary + ` passed`;

    } else {
        if (totals.passed > 0) summary += `, ${withIcons ? '✅ ' : ''}${totals.passed} passed`;
        if (totals.skipped > 0) summary += `, ${withIcons ? '🟡 ' : ''}${totals.skipped} skipped`;
        if (totals.failed > 0) summary += `, ${withIcons ? '❌ ' : ''}${totals.failed} failed`;
        if (totals.errors > 0) summary += `, ${withIcons ? '🛑 ' : ''}${entry(totals.errors, "error")}`;
    }
    return summary;
}

function summaryOfChecks(checks: ParseResults['checks']['totals'], withIcons = false) {
    let summary = '';
    if (checks.errors > 0) {
        if (withIcons) summary += '🛑 ';
        summary += entry(checks.errors, "error");
    }
    if (checks.warnings > 0) {
        if (summary) summary += ', ';
        if (withIcons) summary += '⚠️ ';
        summary += entry(checks.warnings, "warning");
    }
    if (checks.others > 0) {
        if (summary) summary += ', ';
        if (withIcons) summary += '💡 ';
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
    let table = ``;
    for (const check of checks.checks) {
        table = `|${check.name}|🛑 ${entry(check.errors, 'error')}|⚠️ ${entry(check.warnings, 'warning')}|💡 ${entry(check.others, 'other')}\n`;
        table += `|:-|-|-|-|\n`;
        for (const [issue, {severity, count}] of Object.entries(check.issues)) {
            table += `|${issue}|${severity == 'error' ? count : '0'}|${severity == 'warning' ? count : '0'}|${severity == 'other' ? count : '0'}|\n`;
        }
        table += `\n`;
    }
    return table;
}

export function summaryTableOf(results: ParseResults, summaryMode: typeof summary = summary) {
    let content = '';
    if (summaryMode != 'off') {
        if (results.tests.totals.count > 0) {
            content += summaryMode == 'totals' ?
                `Tests: ${summaryOfTests(results.tests.totals, true)}` :
                summaryTableOfTests(results.tests);
        }
        if (results.checks.totals.count > 0) {
            if (content) content += '\n';
            content += summaryMode == 'totals' ?
                `Checks: ${summaryOfChecks(results.checks.totals, true)}` :
                summaryTableOfChecks(results.checks);
        }
    }
    return content;
}
