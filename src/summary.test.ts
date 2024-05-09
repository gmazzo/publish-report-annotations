import {ParseResults} from "./types";
import {summaryOf, summaryTableOf} from "./summary";

describe("summaryOf", () => {

    test("only tests, all passed", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 3,
                    passed: 3,
                    skipped: 0,
                    failed: 0,
                    errors: 0
                }
            }
        }));

        expect(result).toBe("3 tests passed");
    });

    test("only tests, with failures", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 5,
                    passed: 2,
                    skipped: 1,
                    failed: 1,
                    errors: 1
                }
            }
        }));

        expect(result).toBe("5 tests, 2 passed, 1 skipped, 1 failed, 1 error");
    });

    test("only checks", () => {
        const result = summaryOf(new ParseResults({
            checks: {
                checks: [],
                totals: {
                    count: 5,
                    errors: 3,
                    warnings: 1,
                    others: 1
                }
            }
        }));

        expect(result).toBe("3 errors, 1 warning, 1 other");
    });

    test("tests and checks", () => {
        const result = summaryOf(new ParseResults({
            tests: {
                suites: [],
                totals: {
                    count: 3,
                    passed: 2,
                    skipped: 1,
                    failed: 0,
                    errors: 0
                }
            },
            checks: {
                checks: [],
                totals: {
                    count: 4,
                    errors: 1,
                    warnings: 3,
                    others: 0
                }
            }
        }));

        expect(result).toBe("3 tests, 2 passed, 1 skipped, checks: 1 error, 3 warnings");
    });

});

describe("summaryTableOf", () => {

    test("produces expected result", () => {
        const html = summaryTableOf(new ParseResults({
            tests: {
                suites: [
                    {
                        name: "suite1", tests: 5, passed: 2, errors: 0, skipped: 1, failed: 1, time: 4, cases: [
                            {name: "case1", time: 0.1},
                            {name: "case2", time: 0.2},
                            {name: "case3", time: 0.3, skipped: true},
                            {name: "case4", time: 0.4, failure: "a Failure"}
                        ]
                    },
                    {
                        name: "suite2", tests: 2, passed: 2, errors: 0, skipped: 0, failed: 0, time: 2, cases: [
                            {name: "case1", time: 0.1},
                            {name: "case2", time: 0.2},
                        ]
                    }
                ], totals: {count: 4, passed: 2, errors: 0, skipped: 1, failed: 1}
            },
            checks: {
                checks: [
                    {name: "check1", errors: 3, warnings: 1, others: 2},
                    {name: "check2", errors: 7, warnings: 3, others: 4},
                ], totals: {count: 6, errors: 3, warnings: 2, others: 1}
            }
        }));

        expect(html).toBe('<h2>Tests</h2><table><tr><th>Tests</th><th>✅ 2 passed</th><th>🟡 1 skipped</th><th>❌ 1 failed</th></tr><tr><td><i>❌ suite1 (⌛ 4s)</i></td><td><i>2</i></td><td><i>1</i></td><td><i>1</i></td></tr><tr><td>✅ case1 (⌛ 0.1s)<br/>✅ case2 (⌛ 0.2s)<br/>🟡 case3 (⌛ 0.3s)<br/>❌ case4 (⌛ 0.4s)<br/></td><td colspan="3"/></tr><tr><td><i>✅ suite2 (⌛ 2s)</i></td><td><i>2</i></td><td><i>0</i></td><td><i>0</i></td></tr><tr><td>✅ case1 (⌛ 0.1s)<br/>✅ case2 (⌛ 0.2s)<br/></td><td colspan="3"/></tr></table><h2>Checks</h2><table><tr><th>Checks</th><th>🛑 3 errors</th><th>⚠️ 2 warnings</th><th>💡 1 other</th></tr><tr><td>check1</td><td>3</td><td>1</td><td>2</td></tr><tr><td>check2</td><td>7</td><td>3</td><td>4</td></tr></table>');
    });

});
