import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {Config, ParseResults, TestCase} from "../types";
import {Parser} from "./parser";

type JUnitTest = {
    _attributes: {
        name: string,
        classname: string,
        time?: string,
        file?: string,
        line?: string,
        flaky?: string,
    }
    skipped?: boolean,
    failure: [{
        _attributes: {
            message: string,
            type: string,
        }
        _text: string,
    }]
    flaky?: boolean
    retries?: number
};

type JUnitSuite = {
    _attributes: {
        name: string
        time?: string,
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

const possibleExtensions = ['java', 'kt', 'groovy']

export const junitParser: Parser = {

    async parse(filePath: string, config: Config) {
        const data: JUnitData = await readFile(filePath);

        if (data?.testsuite || data?.testsuites) {
            const result = new ParseResults();

            for (const testSuite of asArray(data.testsuites?.testsuite || data.testsuite)) {
                const testCases = asArray(testSuite.testcase);

                // removes cases with same `className` and `name`, as they are considered retries of the same test
                if (config.detectFlakyTests) {
                    const seenAt: {
                        [key: string]: {
                            mostSignificant: JUnitTest,
                            previous: JUnitTest,
                            previousIndex: number,
                            passed: boolean,
                            failed: boolean
                        }
                    } = {};

                    for (const [index, testCase] of testCases.entries()) {
                        if (testCase.skipped) continue;

                        const key = `${testCase._attributes.classname}|${testCase._attributes.name}`;
                        const entry = seenAt[key];

                        if (entry) {
                            entry.mostSignificant.retries!++;

                            if (testCase.failure) {
                                testCase.retries = entry.mostSignificant.retries;
                                entry.failed = true;
                                entry.mostSignificant = testCase;
                            } else {
                                entry.passed = true;
                            }
                            delete testCases[entry.previousIndex];

                            entry.previous = testCase;
                            entry.previousIndex = index;

                        } else {
                            testCase.retries = 0;
                            seenAt[key] = {
                                mostSignificant: testCase,
                                previous: testCase,
                                previousIndex: index,
                                passed: !testCase.failure,
                                failed: !!testCase.failure,
                            };
                        }
                    }

                    for (const entry of Object.values(seenAt)) {
                        if (entry.mostSignificant.retries! > 0) {
                            // restores the most significant test case (of the retries) to be processed later
                            testCases[entry.previousIndex] = entry.mostSignificant;

                            if (entry.passed && entry.failed) {
                                entry.mostSignificant.flaky = true;
                            }
                        }
                    }
                }

                let failed = 0;
                let skipped = 0;
                let flaky;
                const cases: TestCase[] = [];
                for (const testCase of testCases) {
                    if (!testCase) continue;

                    if (testCase._attributes.flaky === 'true') testCase.flaky = true;
                    if (testCase.flaky) flaky = (flaky || 0) + 1;

                    if (testCase.failure) {
                        if (!testCase.flaky) failed++;

                        let filePath: string
                        if (testCase._attributes.file) {
                            filePath = await resolveFile(testCase._attributes.file);

                        } else {
                            filePath = await resolveFile(testCase._attributes.classname.replace(/\./g, '/'), ...possibleExtensions, '*');

                            const extensionIndex = filePath.lastIndexOf('.');
                            if (extensionIndex) {
                                const extension = filePath.substring(extensionIndex + 1);

                                if (!possibleExtensions.includes(extension)) {
                                    possibleExtensions.push(extension);
                                }
                            }
                        }

                        for (const failure of asArray(testCase.failure)) {
                            const line = getLine(testCase, failure._text);

                            result.addAnnotation({
                                file: filePath,
                                severity: testCase.flaky ? 'warning' : 'error',
                                title: testCase.flaky ? `(❗Flaky) ${testCase._attributes.name}` : testCase._attributes.name,
                                message: failure._attributes?.message || failure._text || `${testCase._attributes.name} failed`,
                                rawDetails: failure._text,
                                startLine: line,
                                endLine: line,
                            });
                        }

                    } else if (testCase.skipped) {
                        skipped++;
                    }

                    cases.push({
                        name: testCase._attributes.name,
                        className: testCase._attributes.classname,
                        took: testCase._attributes.time,
                        outcome: testCase.flaky ? 'flaky' : testCase.failure ? 'failed' : testCase.skipped ? 'skipped' : 'passed',
                        ...testCase.retries !== undefined ? {retries: testCase.retries} : {},
                    });
                }

                cases.sort((a, b) => a.className.localeCompare(b.className) || a.name.localeCompare(b.name));
                result.addTestSuite({
                    name: testSuite._attributes.name,
                    took: testSuite._attributes.time,
                    failed,
                    skipped,
                    passed: cases.length - failed - skipped,
                    ...flaky !== undefined ? {flaky} : {},
                    cases,
                });
            }
            return result;
        }
        return null;
    }

};

function getLine(testCase: JUnitTest, stackTrace: string): number | undefined {
    if (testCase._attributes.line) {
        return Number(testCase._attributes.line);
    }

    const className = testCase._attributes.classname;

    if (className && stackTrace) {
        const match = new RegExp(`\\s*at\\s+${className}\\..*?\\(.*?:(\\d+)\\)`).exec(stackTrace);

        if (match) {
            return Number(match[1]);
        }
    }
}
