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
                if (config.ignoreTestRetries) {
                    let retries = 0;
                    const seenAt: { [key: string]: number } = {};

                    testCases.forEach((testCase, index) => {
                        const key = `${testCase._attributes.classname}|${testCase._attributes.name}`;
                        const previousIndex = seenAt[key];

                        if (previousIndex >= 0) {
                            const previous = testCases[previousIndex];

                            suite.count--;
                            retries++;
                            if (previous.failure) {
                                suite.failed--;
                            } else if (previous.skipped) {
                                suite.skipped--;
                            }

                            delete testCases[previousIndex];
                        }
                        seenAt[key] = index;
                    });
                    suite.retries = retries;
                }

                for (const testCase of testCases) {
                    if (testCase?.failure) {
                        const filePath = testCase._attributes.file ?
                            await resolveFile(testCase._attributes.file) :
                            await resolveFile(testCase._attributes.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                        const line = getLine(testCase);

                        result.addAnnotation({
                            file: filePath,
                            severity: 'error',
                            title: testCase._attributes.name,
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
