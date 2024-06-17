import {ParseResults} from "./types";
import config, {Config} from "./config";

function entry(params: {
    amount: number,
    icon?: string,
    type: string,
    simplified?: boolean,
    plural?: boolean,
    header?: boolean
}) {
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

function summaryTableOfTests(
    tests: ParseResults['tests'],
    includeTests: boolean,
    filterPassedTests: boolean,
    settingsChangedDisclaimer: boolean,
) {
    let flakyDisclaimer = false;

    // if skipping passed suites and all passed, we won't produce a table because it's going to be empty
    if (filterPassedTests && tests.totals.passed == tests.totals.count) return '';

    let table = `|Test Suites${settingsChangedDisclaimer ? '[^settingsChanged]' : ''}|✅ ${tests.totals.passed} passed${filterPassedTests ? '[^passedSkipDisclaimer]' : ''}|🟡 ${tests.totals.skipped} skipped|❌ ${tests.totals.failed} failed|⌛ took\n`;
    table += `|:-|-|-|-|-\n`;
    for (const suite of tests.suites) {
        if (filterPassedTests && suite.passed == suite.cases.length && !suite.flaky) continue;

        if (suite.flaky) flakyDisclaimer = true;

        table += '|';
        if (includeTests) table += '<details><summary>';
        table += suite.failed > 0 ? '❌' : suite.skipped > 0 ? '🟡' : suite.flaky ? '❎' : '✅';
        table += suite.flaky ? '❗' : ' ';
        table += suite.name;
        if (suite.flaky) table += ' [^flakyDisclaimer]';
        if (includeTests) {
            table += '</summary><ul>';
            for (const test of suite.cases) {
                if (filterPassedTests && test.outcome == 'passed') continue;

                table += `<li>`;
                switch (test.outcome) {
                    case 'failed':
                        table += '❌ ';
                        break;
                    case 'skipped':
                        table += '🟡 ';
                        break;
                    case 'passed':
                        table += '✅ ';
                        break;
                    case 'flaky':
                        table += '❎❗[^flakyDisclaimer]';
                        break;
                }
                table += test.name;
                if (test.took !== undefined) {
                    table += ` (⌛ ${test.took})`;
                }
                table += '</li>';
            }
            table += '</ul></details>';
        }
        table += '|';
        table += suite.passed;
        table += '|';
        table += suite.skipped;
        table += '|';
        table += suite.failed;
        table += '|';
        if (suite.took !== undefined) {
            table += suite.took;
        }
        table += '\n';
    }
    if (filterPassedTests) table += '[^passedSkipDisclaimer]: ✅ passed suites were not reported\n';
    if (flakyDisclaimer) table += '[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)\n';
    return table;
}

function summaryTableOfChecks(
    checks: ParseResults['checks'],
    settingsChangedDisclaimer: boolean,
) {
    let table = ``;
    for (const check of checks.checks) {
        const headers = [
            entry({header: true, amount: check.errors, icon: '🛑 ', type: 'error'}),
            entry({header: true, amount: check.warnings, icon: '⚠️ ', type: 'warning'}),
            entry({header: true, amount: check.others, icon: '💡 ', type: 'other'})
        ].join('|');

        table += `|${check.name}${settingsChangedDisclaimer ? '[^settingsChanged]' : ''}|${headers}|\n|:-|-|-|-|\n`;
        for (const [issue, {severity, count}] of Object.entries(check.issues)) {
            table += `|${issue}|${severity == 'error' ? count : '0'}|${severity == 'warning' ? count : '0'}|${severity == 'other' ? count : '0'}|\n`;
        }
        table += `\n`;
    }
    return table;
}

export function summaryTableOf(
    results: ParseResults,
    testsSummary: Config['testsSummary'] = config.testsSummary,
    checksSummary: Config['checksSummary'] = config.checksSummary,
    filterPassedTests: Config['filterPassedTests'] = config.filterPassedTests,
) {
    const originalTestsSummary = testsSummary;
    const originalChecksSummary = checksSummary;
    const originalFilterPassedTests = filterPassedTests;

    let content;
    let originalLength;
    let tryReduce;
    do {
        content = '';
        tryReduce = false;

        if (testsSummary != 'off' && results.tests.totals.count > 0) {
            content += testsSummary == 'totals' ?
                `Tests: ${summaryOfTests(results.tests.totals, false)}` :
                summaryTableOfTests(
                    results.tests,
                    testsSummary == 'full',
                    filterPassedTests,
                    testsSummary != originalTestsSummary || filterPassedTests != originalFilterPassedTests);
        }
        if (checksSummary != 'off' && results.checks.totals.count > 0) {
            if (content) content += '\n';
            content += checksSummary == 'totals' ?
                `Checks: ${summaryOfChecks(results.checks.totals, false)}` :
                summaryTableOfChecks(results.checks, checksSummary != originalChecksSummary);
        }

        if (content.length > 65500) {
            if (!originalLength) originalLength = content.length;

            if (!filterPassedTests) {
                filterPassedTests = true;

            } else {
                switch (testsSummary) {
                    case 'full':
                        testsSummary = 'suitesOnly';
                        break;
                    case 'suitesOnly':
                        testsSummary = 'totals';
                        break;
                    case 'totals':
                        testsSummary = 'off';
                        break;
                    default:
                        switch (checksSummary) {
                            case 'full':
                                checksSummary = 'totals';
                                break;
                            case 'totals':
                                checksSummary = 'off';
                                break;
                        }
                }
            }

            tryReduce = testsSummary != 'off' || checksSummary != 'off';
        }
    } while (tryReduce);

    if (originalLength) {
        content += `[^settingsChanged]: Summary table was too long (${originalLength} characters), reduced the following to make it fit into the limits:`;
        if (originalTestsSummary != testsSummary) {
            content += `<br/>- \`testsSummary\` from \`${originalTestsSummary}\` to \`${testsSummary}\``;
        }
        if (originalChecksSummary != checksSummary) {
            content += `<br/>- \`checksSummary\` from \`${originalChecksSummary}\` to \`${checksSummary}\``;
        }
        if (originalFilterPassedTests != filterPassedTests) {
            content += `<br/>- \`filterPassedTests\` from \`${originalFilterPassedTests}\` to \`${filterPassedTests}\``;
        }
    }
    return content;
}
