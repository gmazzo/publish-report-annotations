import {ParseResults} from "./types";
import config, {Config} from "./config";

function entry(params: { amount: number, icon?: string, type: string, simplified?: boolean, plural?: boolean, header?: boolean }) {
    if (!params.header && params.amount == 0) return '';
    let entry = params.icon ? `${params.icon} ` : '';
    entry += params.amount;
    if (params.simplified != true) {
        entry += ' ' + params.type;
        if (params.plural != false && params.amount != 1) entry += 's';
    }
    return entry;
}

function summaryOfTests(totals: ParseResults['tests']['totals'], simplified: boolean) {
    const heading = entry({amount: totals.count, type: "test"});
    if (totals.count == totals.passed) return heading + ` ✅ passed`;

    return heading + `: ` + [
        entry({amount: totals.passed, icon: '✅', simplified, type: 'passed', plural: false}),
        entry({amount: totals.skipped, icon: '🟡', simplified, type: 'skipped', plural: false}),
        entry({amount: totals.failed, icon: '❌', simplified, type: 'failed', plural: false}),
        entry({amount: totals.errors, icon: '🛑', simplified, type: 'error'})
    ].filter(it => it).join(', ');
}

function summaryOfChecks(checks: ParseResults['checks']['totals'], simplified: boolean) {
    return [
        entry({amount: checks.errors, icon: '🛑', simplified, type: 'error'}),
        entry({amount: checks.warnings, icon: '⚠️', simplified, type: 'warning'}),
        entry({amount: checks.others, icon: '💡', simplified, type: 'other'})
    ].filter(it => it).join(', ');
}

export function summaryOf(results: ParseResults, simplified = false) {
    let summary = '';
    if (results.tests.totals.count > 0) summary = summaryOfTests(results.tests.totals, simplified);
    if (results.checks.totals.count > 0) {
        if (summary) summary += ', checks: ';
        summary += summaryOfChecks(results.checks.totals, simplified);
    }
    return summary;
}

function summaryTableOfTests(tests: ParseResults['tests'], summaryMode: Config['summary']) {
    const skipPassed = summaryMode == 'detailedWithoutPassed';

    // if skipping passed suites and all passed, we won't produce a table because is going to be empty
    if (skipPassed && tests.totals.passed == tests.totals.count) return '';

    let table = `|Test Suites|✅ ${tests.totals.passed} passed${skipPassed ? '[^passedSkipDisclaimer]' : ''}|🟡 ${tests.totals.skipped} skipped|❌ ${tests.totals.failed + tests.totals.errors} failed|⌛ took\n`;
    table += `|:-|-|-|-|-|\n`;
    for (const suite of tests.suites) {
        if (!skipPassed || suite.count != suite.passed) {
            table += `|${suite.failed + suite.errors > 0 ? '❌' : suite.skipped > 0 ? '🟡' : '✅'} ${suite.name}|${suite.passed}|${suite.skipped}|${suite.failed + suite.errors}|${suite.took}s\n`;
        }
    }
    if (skipPassed) {
        table += '[^passedSkipDisclaimer]: ✅ passed suites were not reported\n';
    }
    return table;
}

function summaryTableOfChecks(checks: ParseResults['checks']) {
    let table = ``;
    for (const check of checks.checks) {
        const headers = [
            entry({header: true, amount: check.errors, icon: '🛑', type: 'error'}),
            entry({header: true, amount: check.warnings, icon: '⚠️', type: 'warning'}),
            entry({header: true, amount: check.others, icon: '💡', type: 'other'})
        ].join('|');

        table += `|${check.name}|${headers}|\n|:-|-|-|-|\n`;
        for (const [issue, {severity, count}] of Object.entries(check.issues)) {
            table += `|${issue}|${severity == 'error' ? count : '0'}|${severity == 'warning' ? count : '0'}|${severity == 'other' ? count : '0'}|\n`;
        }
        table += `\n`;
    }
    return table;
}

export function summaryTableOf(results: ParseResults, summaryMode: Config['summary'] = config.summary) {
    let content = '';
    if (summaryMode != 'off') {
        if (results.tests.totals.count > 0) {
            content += summaryMode == 'totals' ?
                `Tests: ${summaryOfTests(results.tests.totals, false)}` :
                summaryTableOfTests(results.tests, summaryMode);
        }
        if (results.checks.totals.count > 0) {
            if (content) content += '\n';
            content += summaryMode == 'totals' ?
                `Checks: ${summaryOfChecks(results.checks.totals, false)}` :
                summaryTableOfChecks(results.checks);
        }
    }
    return content;
}
