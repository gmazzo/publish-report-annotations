import {Parser} from "./parser";
import {readFile} from "./readFile";

type TestCase = {
    _attrs: {
        name: string,
        classname: string,
        file?: string,
        line?: number,
    }
    skipped?: boolean,
    failure?: {
        message: string,
        type: string,
        _text: string,
    }
}

type JunitData = {
    testsuite?: {
        testcase: TestCase | TestCase[],
    }
}

export const junitParser: Parser = {

    async parse(filepath: string) {
        const data: JunitData = await readFile(filepath)

        if (data?.testsuite) {
            const cases = Array.isArray(data.testsuite.testcase) ? data.testsuite.testcase : [data.testsuite.testcase]
            return cases.flatMap(annotation => {
                if (annotation.failure) {
                    return {
                        type: 'failure',
                        title: annotation._attrs.name,
                        message: annotation.failure.message,
                        raw_details: annotation.failure._text,
                        startLine: annotation._attrs.line,
                        endLine: annotation._attrs.line,
                    }
                }
                return []
            })
        }
        return null;
    }

}
