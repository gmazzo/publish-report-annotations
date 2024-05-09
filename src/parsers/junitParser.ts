import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {Parser} from "./parser";
import {ParseResults, TestCase} from "../types";

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

    async parse(filepath: string) {
        const data: JUnitData = await readFile(filepath);

        if (data?.testsuite || data?.testsuites) {
            const result = new ParseResults();

            for (const testSuite of asArray(data.testsuites?.testsuite || data.testsuite)) {
                const suite = {
                    name: testSuite._attributes.name,
                    time: testSuite._attributes.time,
                    cases: [] as TestCase[],
                    tests: testSuite._attributes.tests || 0,
                    errors: testSuite._attributes.errors || 0,
                    failed: testSuite._attributes.failures || 0,
                    skipped: testSuite._attributes.skipped || 0,
                };

                for (const testCase of asArray(testSuite.testcase)) {
                    suite.cases.push({
                        name: testCase._attributes.name,
                        time: testCase._attributes.time,
                        skipped: !!testCase.skipped,
                        failure: testCase.failure?._attributes?.message,
                    });

                    if (testCase.failure) {
                        const filePath = testCase._attributes.file ?
                            await resolveFile(testCase._attributes.file) :
                            await resolveFile(testCase._attributes.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                        const line = getLine(testCase);

                        result.addAnnotation({
                            file: filePath,
                            type: 'error',
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
                    passed: suite.tests - suite.errors - suite.failed - suite.skipped,
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
    const method = testCase._attributes.name;
    const stackTrace = testCase.failure?._text;

    if (className && method && stackTrace) {
        const singleName = className.split('.').pop();
        const match = new RegExp(`\\s*at\\s+${className}\\.${method}\\(${singleName}\\.\\w+:(\\d+)\\)`).exec(stackTrace);

        if (match) {
            return Number(match[1]);
        }
    }
}
