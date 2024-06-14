import {ParseResults} from "./types";
import config, {Config, SummaryMode} from "./config";

function entry(params: { amount: number, icon?: string, type: string, simplified?: boolean, plural?: boolean, header?: boolean }) {
    if (!params.header && params.amount == 0) return '';
    let entry = params.icon ? params.icon : '';
    entry += params.amount;
    if (params.simplified != true) {
        entry += ' ' + params.type;
        if (params.plural != false && params.amount != 1) entry += 's';
    }
    return entry;
}

function summaryOfTests(totals: ParseResults['tests']['totals'], simplified: boolean) {
    const heading = entry({amount: totals.count, type: "test"});
    if (totals.count == totals.passed) {
        let content = heading + ` ✅ passed`;
        if (totals.flaky || 0 > 0) {
            content += ` (${totals.flaky} ❗flaky)`;
        }
        return content;
    }

    const passed = entry({amount: totals.passed, icon: '✅ ', simplified, type: 'passed', plural: false});
    const flaky = entry({amount: totals.flaky || 0, icon: '❗', simplified, type: 'flaky', plural: false});

    return heading + `: ` + [
        flaky ? `${passed} (${flaky})` : passed,
        entry({amount: totals.skipped, icon: '🟡 ', simplified, type: 'skipped', plural: false}),
        entry({amount: totals.failed, icon: '❌ ', simplified, type: 'failed', plural: false}),
    ].filter(it => it).join(', ');
}

function summaryOfChecks(checks: ParseResults['checks']['totals'], simplified: boolean) {
    return [
        entry({amount: checks.errors, icon: '🛑 ', simplified, type: 'error'}),
        entry({amount: checks.warnings, icon: '⚠️ ', simplified, type: 'warning'}),
        entry({amount: checks.others, icon: '💡 ', simplified, type: 'other'})
    ].filter(it => it).join(', ');
}

export function summaryOf(results: ParseResults, simplified = false) {
    let summary = '';
    if (results.tests.totals.count > 0) summary = summaryOfTests(results.tests.totals, simplified);
    if (results.checks.totals.count > 0) {
        summary += summary ? ', checks: ' : 'Checks: ';
        summary += summaryOfChecks(results.checks.totals, simplified);
    }
    return summary ? summary : `No issues found`;
}

function summaryTableOfTests(tests: ParseResults['tests'], summaryMode: SummaryMode) {
    let flakyDisclaimer = false;

    // if skipping passed suites and all passed, we won't produce a table because is going to be empty
    if (summaryMode.tests.skipPassed && tests.totals.passed == tests.totals.count) return '';

    let table = `|Test Suites|✅ ${tests.totals.passed} passed${summaryMode.tests.skipPassed ? '[^passedSkipDisclaimer]' : ''}|🟡 ${tests.totals.skipped} skipped|❌ ${tests.totals.failed} failed|⌛ took\n`;
    table += `|:-|-|-|-|-\n`;
    for (const suite of tests.suites) {
        if (!summaryMode.tests.skipPassed || suite.count != suite.passed || suite.flaky) {
            if (suite.flaky) flakyDisclaimer = true;

            table += '|';
            table += suite.failed > 0 ? '❌ ' : suite.skipped > 0 ? '🟡 ' : suite.flaky ? '❎❗' : '✅ ';
            table += suite.name;
            if (suite.flaky) table += ' [^flakyDisclaimer]';
            table += '|';
            table += suite.passed;
            table += '|';
            table += suite.skipped;
            table += '|';
            table += suite.failed;
            table += '|';
            table += suite.took;
            table += 's\n';
        }
    }
    if (summaryMode.tests.skipPassed) table += '[^passedSkipDisclaimer]: ✅ passed suites were not reported\n';
    if (flakyDisclaimer) table += '[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)\n';
    return table;
}

function summaryTableOfChecks(checks: ParseResults['checks']) {
    let table = ``;
    for (const check of checks.checks) {
        const headers = [
            entry({header: true, amount: check.errors, icon: '🛑 ', type: 'error'}),
            entry({header: true, amount: check.warnings, icon: '⚠️ ', type: 'warning'}),
            entry({header: true, amount: check.others, icon: '💡 ', type: 'other'})
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
    if (summaryMode) {
        if (results.tests.totals.count > 0) {
            content += !summaryMode.tests.suites && !summaryMode.tests.cases ?
                `Tests: ${summaryOfTests(results.tests.totals, false)}` :
                summaryTableOfTests(results.tests, summaryMode);
        }
        if (results.checks.totals.count > 0) {
            if (content) content += '\n';
            content += !summaryMode.checks ?
                `Checks: ${summaryOfChecks(results.checks.totals, false)}` :
                summaryTableOfChecks(results.checks);
        }
    }
    return content;
}
