import { Config, AggregatedResults } from "./types";
import bytes from "bytes";

function entry(params: {
    amount: number;
    icon?: string;
    type: string;
    simplified?: boolean;
    plural?: boolean;
    header?: boolean;
}) {
    if (!params.header && params.amount == 0) return "";
    let entry = params.icon ? params.icon : "";
    entry += params.amount;
    if (params.simplified != true) {
        entry += " " + params.type;
        if (params.plural != false && params.amount != 1) entry += "s";
    }
    return entry;
}

function summaryOfTests(totals: AggregatedResults["tests"]["totals"], simplified: boolean) {
    const heading = entry({ amount: totals.count, type: "test" });
    if (totals.count == totals.passed) {
        let content = heading + ` ✅ passed`;
        if (totals.flaky || 0 > 0) {
            content += ` (${totals.flaky} ❗flaky)`;
        }
        return content;
    }

    const passed = entry({ amount: totals.passed, icon: "✅ ", simplified, type: "passed", plural: false });
    const flaky = entry({ amount: totals.flaky || 0, icon: "❗", simplified, type: "flaky", plural: false });

    return (
        heading +
        `: ` +
        [
            flaky ? `${passed} (${flaky})` : passed,
            entry({ amount: totals.skipped, icon: "🟡 ", simplified, type: "skipped", plural: false }),
            entry({ amount: totals.failed, icon: "❌ ", simplified, type: "failed", plural: false }),
        ]
            .filter((it) => it)
            .join(", ")
    );
}

function summaryOfChecks(checks: AggregatedResults["checks"]["totals"], simplified: boolean) {
    return [
        entry({ amount: checks.errors, icon: "🛑 ", simplified, type: "error" }),
        entry({ amount: checks.warnings, icon: "⚠️ ", simplified, type: "warning" }),
        entry({ amount: checks.others, icon: "💡 ", simplified, type: "other" }),
    ]
        .filter((it) => it)
        .join(", ");
}

export function summaryOf(results: AggregatedResults, simplified = false) {
    let summary = "";
    if (results.tests.totals.count > 0) summary = summaryOfTests(results.tests.totals, simplified);
    if (results.checks.totals.count > 0) {
        summary += summary ? ", checks: " : "Checks: ";
        summary += summaryOfChecks(results.checks.totals, simplified);
    }
    if (results.failures.length > 0) {
        if (summary) summary += ", ";
        summary += entry({ amount: results.failures.length, icon: "‼️ ", simplified, type: "failure" });
    }
    return summary ? summary : results.files.length > 0 ? "No issues found" : "❗No report files found";
}

function summaryTableOfTests(
    tests: AggregatedResults["tests"],
    includeTests: boolean,
    filterPassedTests: boolean,
    linksInSummaries: boolean,
    settingsChangedDisclaimer: boolean,
) {
    let flakyDisclaimer = false;
    const anchors = linksInSummaries ? new AnchorGenerator("t") : { next: () => "" };

    // if skipping passed suites and all passed, we won't produce a table because it's going to be empty
    if (filterPassedTests && tests.totals.passed == tests.totals.count) return "";

    let table = `|Test Suites${settingsChangedDisclaimer ? "[^settingsChanged]" : ""}|✅ ${tests.totals.passed} passed${filterPassedTests ? "[^passedSkipDisclaimer]" : ""}|🟡 ${tests.totals.skipped} skipped|❌ ${tests.totals.failed} failed|⌛ took\n`;
    table += `|:-|-|-|-|-\n`;
    for (const suite of tests.suites) {
        if (filterPassedTests && suite.passed == suite.cases.length && !suite.flaky) continue;

        if (suite.flaky) flakyDisclaimer = true;

        table += "|";
        if (includeTests) table += "<details><summary>";
        table += suite.failed > 0 ? "❌" : suite.skipped > 0 ? "🟡" : suite.flaky ? "❎" : "✅";
        table += suite.flaky ? "❗" : " ";
        table += suite.name;
        table += anchors.next();
        if (suite.flaky) table += " [^flakyDisclaimer]";
        if (includeTests) {
            table += "</summary><ul>";
            for (const test of suite.cases) {
                if (filterPassedTests && test.outcome == "passed") continue;

                table += `<li>`;
                switch (test.outcome) {
                    case "failed":
                        table += "❌ ";
                        break;
                    case "skipped":
                        table += "🟡 ";
                        break;
                    case "passed":
                        table += "✅ ";
                        break;
                    case "flaky":
                        table += "❎❗[^flakyDisclaimer]";
                        break;
                }
                table += test.name;
                table += anchors.next();
                if (test.took !== undefined) {
                    table += ` (⌛ ${test.took})`;
                }
                table += "</li>";
            }
            table += "</ul></details>";
        }
        table += "|";
        table += suite.passed;
        table += "|";
        table += suite.skipped;
        table += "|";
        table += suite.failed;
        table += "|";
        if (suite.took !== undefined) {
            table += suite.took;
        }
        table += "\n";
    }
    if (filterPassedTests) table += "[^passedSkipDisclaimer]: ✅ passed suites were not reported\n";
    if (flakyDisclaimer)
        table += "[^flakyDisclaimer]: ❎❗flaky test (some executions have passed, others have failed)\n";
    return table;
}

function summaryTableOfChecks(
    checks: AggregatedResults["checks"],
    linksInSummaries: boolean,
    settingsChangedDisclaimer: boolean,
) {
    const anchors = linksInSummaries ? new AnchorGenerator("c") : { next: () => "" };
    let table = ``;

    for (const check of checks.checks) {
        const headers = [
            entry({ header: true, amount: check.errors, icon: "🛑 ", type: "error" }),
            entry({ header: true, amount: check.warnings, icon: "⚠️ ", type: "warning" }),
            entry({ header: true, amount: check.others, icon: "💡 ", type: "other" }),
        ].join("|");

        table += `|${check.name}${anchors.next()}${settingsChangedDisclaimer ? "[^settingsChanged]" : ""}|${headers}|\n|:-|-|-|-|\n`;
        for (const [issue, { severity, count }] of Object.entries(check.issues)) {
            table += `|${issue}${anchors.next()}|${severity == "error" ? count : "0"}|${severity == "warning" ? count : "0"}|${severity == "other" ? count : "0"}|\n`;
        }
        table += `\n`;
    }
    return table;
}

export function summaryTableOf(results: AggregatedResults, config: Config) {
    let testsSummary = config.testsSummary;
    let checksSummary = config.checksSummary;
    let filterPassedTests = config.filterPassedTests;
    let linksInSummaries = config.linksInSummaries;

    let content;
    let originalByteSize;
    let tryReduce;
    do {
        content = "";
        tryReduce = false;

        if (testsSummary != "off" && results.tests.totals.count > 0) {
            content +=
                testsSummary == "totals"
                    ? `Tests: ${summaryOfTests(results.tests.totals, false)}`
                    : summaryTableOfTests(
                          results.tests,
                          testsSummary == "full",
                          filterPassedTests,
                          linksInSummaries,
                          testsSummary != config.testsSummary ||
                              filterPassedTests != config.filterPassedTests ||
                              linksInSummaries != config.linksInSummaries,
                      );
        }
        if (checksSummary != "off" && results.checks.totals.count > 0) {
            if (content) content += "\n";
            content +=
                checksSummary == "totals"
                    ? `Checks: ${summaryOfChecks(results.checks.totals, false)}`
                    : summaryTableOfChecks(
                          results.checks,
                          linksInSummaries,
                          checksSummary != config.checksSummary || linksInSummaries != config.linksInSummaries,
                      );
        }
        if (results.failures.length > 0) {
            content +=
                "\n\n> [!CAUTION]\n" +
                "> There were some failures processing report files:\n" +
                results.failures.map((it) => `> - \`${it}\``).join("\n");
        }

        const byteSize = Buffer.byteLength(content, "utf8");
        if (byteSize > 65535) {
            if (!originalByteSize) originalByteSize = byteSize;

            if (!filterPassedTests) {
                filterPassedTests = true;
            } else if (linksInSummaries) {
                linksInSummaries = false;
            } else {
                switch (testsSummary) {
                    case "full":
                        testsSummary = "suitesOnly";
                        break;
                    case "suitesOnly":
                        testsSummary = "totals";
                        break;
                    case "totals":
                        testsSummary = "off";
                        break;
                    default:
                        switch (checksSummary) {
                            case "full":
                                checksSummary = "totals";
                                break;
                            case "totals":
                                checksSummary = "off";
                                break;
                        }
                }
            }

            tryReduce = testsSummary != "off" || checksSummary != "off";
        }
    } while (tryReduce);

    if (originalByteSize) {
        content += `[^settingsChanged]: Summary table was too long (${bytes(originalByteSize)}), reduced the following to make it fit into the limits:`;
        if (config.testsSummary != testsSummary) {
            content += `<br/>- \`testsSummary\` from \`${config.testsSummary}\` to \`${testsSummary}\``;
        }
        if (config.checksSummary != checksSummary) {
            content += `<br/>- \`checksSummary\` from \`${config.checksSummary}\` to \`${checksSummary}\``;
        }
        if (config.filterPassedTests != filterPassedTests) {
            content += `<br/>- \`filterPassedTests\` from \`${config.filterPassedTests}\` to \`${filterPassedTests}\``;
        }
    }
    return content;
}

class AnchorGenerator {
    private readonly prefix: string;
    private index = 0;
    constructor(prefix: string) {
        this.prefix = prefix;
    }
    next() {
        const id = `${this.prefix}${++this.index}`;
        return `<sup id=\"${id}\"><a href="#${id}">#</a></sup>`;
    }
}
