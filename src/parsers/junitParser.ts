import {readFile} from "./readFile";
import {asArray} from "../utils";
import {resolveFile} from "./resolveFile";
import {Parser} from "./parser";
import ParsedAnnotations from "../ParsedAnnotations";

type TestCase = {
    _attributes: {
        name: string,
        classname: string,
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

type TestSuite = {
    testcase: TestCase | TestCase[],
};

type Data = {
    testsuites?: {
        testsuite: TestSuite | TestSuite[],
    },
    testsuite?: TestSuite
};

export const junitParser: Parser = {

    async parse(filepath: string) {
        const data: Data = await readFile(filepath);

        if (data?.testsuite || data?.testsuites) {
            const result = new ParsedAnnotations();

            for (const suite of asArray(data.testsuites?.testsuite || data.testsuite)) {
                for (const testcase of asArray(suite.testcase)) {
                    if (testcase.failure) {
                        const filePath = testcase._attributes.file ?
                            await resolveFile(testcase._attributes.file) :
                            await resolveFile(testcase._attributes.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                        const line = getLine(testcase);

                        result.add({
                            file: filePath,
                            type: 'error',
                            title: testcase._attributes.name,
                            message: testcase.failure._attributes?.message || testcase.failure._text,
                            rawDetails: testcase.failure._text,
                            startLine: line,
                            endLine: line,
                        });
                    }
                }
            }
            return result;
        }
        return null;
    }

};

function getLine(testcase: TestCase): number | undefined {
    if (testcase._attributes.line) {
        return testcase._attributes.line;
    }

    const className = testcase._attributes.classname;
    const method = testcase._attributes.name;
    const stackTrace = testcase.failure?._text;

    if (className && method && stackTrace) {
        const singleName = className.split('.').pop();
        const match = new RegExp(`\\s*at\\s+${className}\\.${method}\\(${singleName}\\.\\w+:(\\d+)\\)`).exec(stackTrace);

        if (match) {
            return Number(match[1]);
        }
    }
}
