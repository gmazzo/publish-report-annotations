import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {ParseResults, TestSuite} from "../types";
import {Parser} from "./parser";
import config from "../config";

type JUnitTest = {
    _attributes: {
        name: string,
        classname: string,
        time?: number,
        file?: string,
        line?: number,
    }
    skipped?: boolean,
    failure?: {
        _attributes: {
            message: string,
            type: string,
        }
        _text: string,
    }
    flaky?: boolean
};

type JUnitSuite = {
    _attributes: {
        name: string
        time?: number,
        tests?: number
        skipped?: number
        failures?: number
        errors?: number
        retries?: number
    }
    testcase: JUnitTest | JUnitTest[],
};

type JUnitData = {
    testsuites?: {
        testsuite: JUnitSuite | JUnitSuite[],
    },
    testsuite?: JUnitSuite
};

export const junitParser: Parser = {

    async parse(filePath: string) {
        const data: JUnitData = await readFile(filePath);

        if (data?.testsuite || data?.testsuites) {
            const result = new ParseResults();

            for (const testSuite of asArray(data.testsuites?.testsuite || data.testsuite)) {
                const suite: TestSuite = {
                    name: testSuite._attributes.name,
                    took: testSuite._attributes.time,
                    count: testSuite._attributes.tests || 0,
                    errors: testSuite._attributes.errors || 0,
                    failed: testSuite._attributes.failures || 0,
                    skipped: testSuite._attributes.skipped || 0,
                    passed: 0, // will be calculated later
                };

                const testCases = asArray(testSuite.testcase);

                // removes cases with same `className` and `name`, as they are considered retries of the same test
                if (config.detectFlakyTests) {
                    const seenAt: { [key: string]: { retried: boolean, lastFailure?: JUnitTest, previous: JUnitTest, previousIndex: number, passed: boolean, failed: boolean } } = {};

                    for (const [index, testCase] of testCases.entries()) {
                        if (testCase.skipped) continue;

                        const key = `${testCase._attributes.classname}|${testCase._attributes.name}`;
                        const entry = seenAt[key];

                        if (entry) {
                            entry.retried = true;

                            suite.count--;
                            if (entry.previous.failure) {
                                suite.failed--;
                            } else if (entry.previous.skipped) {
                                suite.skipped--;
                            }
                            if (testCase.failure) {
                                entry.failed = true;
                                entry.lastFailure = testCase;
                            } else {
                                entry.passed = true;
                            }

                            delete testCases[entry.previousIndex];

                            entry.previous = testCase;
                            entry.previousIndex = index;

                        } else {
                            seenAt[key] = {
                                retried: false,
                                lastFailure: testCase.failure ? testCase : undefined,
                                previous: testCase,
                                previousIndex: index,
                                passed: !testCase.failure,
                                failed: !!testCase.failure,
                            };
                        }
                    }

                    let flaky = 0;
                    for (const entry of Object.values(seenAt)) {
                        if (entry.retried) {
                            if (entry.passed && entry.failed) {
                                flaky++;
                            }
                            if (entry.lastFailure) {
                                // reports last failure, if no execution has passed
                                entry.lastFailure.flaky = entry.passed;
                                testCases[entry.previousIndex] = entry.lastFailure;
                            }
                        }
                    }
                    suite.flaky = flaky;
                }

                for (const testCase of testCases) {
                    if (testCase?.failure) {
                        const filePath = testCase._attributes.file ?
                            await resolveFile(testCase._attributes.file) :
                            await resolveFile(testCase._attributes.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                        const line = getLine(testCase);

                        result.addAnnotation({
                            file: filePath,
                            severity: testCase.flaky ? 'warning' : 'error',
                            title: testCase.flaky ? `(❗Flaky) ${testCase._attributes.name}` : testCase._attributes.name,
                            message: testCase.failure._attributes?.message || testCase.failure._text,
                            rawDetails: testCase.failure._text,
                            startLine: line,
                            endLine: line,
                        });
                    }
                }
                result.addTestSuite({
                    ...suite,
                    passed: suite.count - suite.errors - suite.failed - suite.skipped,
                });
            }
            return result;
        }
        return null;
    }

};

function getLine(testCase: JUnitTest): number | undefined {
    if (testCase._attributes.line) {
        return testCase._attributes.line;
    }

    const className = testCase._attributes.classname;
    const stackTrace = testCase.failure?._text;

    if (className && stackTrace) {
        const match = new RegExp(`\\s*at\\s+${className}\\..*?\\(.*?:(\\d+)\\)`).exec(stackTrace);

        if (match) {
            return Number(match[1]);
        }
    }
}
