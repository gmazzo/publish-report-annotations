import {ParsedAnnotation, Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray} from "./utils";
import {resolveFile} from "./resolveFile";

type TestCase = {
    _attrs: {
        name: string,
        classname: string,
        file?: string,
        line?: number,
    }
    skipped?: boolean,
    failure?: {
        _attrs: {
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
                    const filePath = testcase._attrs.file ?
                        await resolveFile(testcase._attrs.file) :
                        await resolveFile(testcase._attrs.classname.replace(/\./g, '/'), 'java', 'kt', 'groovy');

                    result.push({
                        file: filePath,
                        type: 'error',
                        title: testcase._attrs.name,
                        message: testcase.failure._attrs.message,
                        raw_details: testcase.failure._text,
                        startLine: testcase._attrs.line || 0,
                        endLine: testcase._attrs.line || 0,
                    });
                }
            }
            return result;
        }
        return null;
    }

};
