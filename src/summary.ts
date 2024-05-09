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

function escapeHTML(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function summaryTableOfTests(tests: ParseResults['tests']) {
    let table = '<table>';
    table += `<tr><th>Tests</th><th>✅ ${tests.totals.passed} passed</th><th>🟡 ${tests.totals.skipped} skipped</th><th>❌ ${tests.totals.failed + tests.totals.errors} failed</th></tr>`;
    for (const suite of tests.suites) {
        table += `<tr><td><i>${suite.failed + suite.errors > 0 ? '❌' : suite.skipped > 0 ? '🟡' : '✅'} ${escapeHTML(suite.name)} (⌛ ${suite.time}s)</i></td><td><i>${suite.passed}</i></td><td><i>${suite.skipped}</i></td><td><i>${suite.failed + suite.errors}</i></td></tr>`;
        table += `<tr><td>`;
        for (const test of suite.cases) {
            table += `${test.failure ? '❌' : test.skipped ? '🟡' : '✅'} ${escapeHTML(test.name)} (⌛ ${test.time}s)<br/>`;
        }
        table += `</td><td colspan="3"/></tr>`;
    }
    table += `</table>`;
    return table;
}

function summaryTableOfChecks(checks: ParseResults['checks']) {
    let table = '<table>';
    table += `<tr><th>Checks</th><th>🛑 ${entry(checks.totals.errors, 'error')}</th><th>⚠️ ${entry(checks.totals.warnings, 'warning')}</th><th>💡 ${entry(checks.totals.others, 'other')}</th></tr>`;
    for (const check of checks.checks) {
        table += `<tr><td>${escapeHTML(check.name)}</td><td>${check.errors}</td><td>${check.warnings}</td><td>${check.others}</td></tr>`;
    }
    table += `</table>`;
    return table;
}

export function summaryTableOf(results: ParseResults) {
    let table = '';
    if (results.tests.totals.count > 0) {
        table += '<h2>Tests</h2>';
        table += summaryTableOfTests(results.tests);
    }
    if (results.checks.totals.count > 0) {
        table += '<h2>Checks</h2>';
        table += summaryTableOfChecks(results.checks);
    }
    return table;
}
