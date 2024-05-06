import {ParsedAnnotation, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "./utils";
import {resolveFile} from "./resolveFile";

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

type Data = {
    testsuite?: {
        testcase: TestCase | TestCase[],
    }
};

export const junitParser: Parser = {

    async parse(filepath: string) {
        const data: Data = await readFile(filepath);

        if (data?.testsuite) {
            const result: ParsedAnnotation[] = [];

            for (const testcase of asArray(data.testsuite.testcase)) {
                if (testcase.failure) {
                    const filePath = testcase._attributes.file ?
                        await resolveFile(testcase._attributes.file) :
                        await resolveFile(testcase._attributes.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                    result.push({
                        file: filePath,
                        type: 'error',
                        title: testcase._attributes.name,
                        message: testcase.failure._attributes.message,
                        raw_details: testcase.failure._text,
                        startLine: testcase._attributes.line || 0,
                        endLine: testcase._attributes.line || 0,
                    });
                }
            }
            return result;
        }
        return null;
    }

};
