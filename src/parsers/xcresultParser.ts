import {Parser} from "./parser";
import {asArray, joinSeparator} from "../utils";
import {ParseResults, TestCase} from "../types";
import {resolveFile} from "./resolveFile";

type TestNode = {
    name: string,
    details?: string,
    result: 'Passed' | 'Failed' | 'Skipped',
    duration?: string,
    nodeType: 'Test Plan' | 'Unit test bundle' | 'Test Suite' | 'Test Case' | 'Repetition' | 'Failure Message',
    children?: TestNode[]
};

export type XCResultData = {
    "testNodes": TestNode[]
}

export const xcresultParser: Parser<XCResultData> = {

    process: async function (data: XCResultData) {
        if (data?.testNodes) {
            const result = new ParseResults();
            const suites = computeSuites(asArray(data.testNodes))

            for (const testSuite of suites) {
                let failed = 0;
                let skipped = 0;
                let flaky = 0;

                const cases: TestCase[] = [];
                for (const testCase of asArray(testSuite.children)) {
                    let outcome: TestCase['outcome']

                    switch (testCase.result) {
                        case 'Passed':
                            outcome = 'passed'
                            break

                        case 'Failed':
                            outcome = 'failed'
                            failed++
                            break

                        case 'Skipped':
                            outcome = 'skipped'
                            skipped++
                            break
                    }

                    const {
                        className,
                        lineNumber,
                        failureMessage,
                        retries,
                        hasFailedRepetitions
                    } = computeChildren(testCase.children)

                    const isFlaky = hasFailedRepetitions && outcome === 'passed'
                    if (isFlaky) {
                        flaky++
                        outcome = 'flaky'
                    }

                    if (outcome === 'failed' || isFlaky) {
                        const file = className && await resolveFile(className)

                        result.addAnnotation({
                            ...file ? {file} : {},
                            severity: isFlaky ? 'warning' : 'error',
                            title: isFlaky ? `(❗Flaky) ${testCase.name}` : testCase.name,
                            message: joinSeparator(": ", testCase.details, failureMessage) || 'Test failed',
                            ...lineNumber ? {startLine: lineNumber, endLine: lineNumber} : {},
                        })
                    }

                    cases.push({
                        name: testCase.name,
                        className: className || testSuite.name,
                        outcome: outcome,
                        ...testCase.duration ? {took: testCase.duration} : {},
                        ...retries > 0 ? {retries: retries - 1} : {},
                    })
                }

                result.addTestSuite({
                    name: testSuite.name,
                    failed,
                    skipped,
                    passed: cases.length - failed - skipped,
                    flaky,
                    cases,
                });
            }
            return result;
        }
        return null;
    }

}

function computeSuites(testNodes: TestNode[]) {
    const suites: TestNode[] = [];
    for (const bundle of testNodes.flatMap(it => asArray(it.children))) {
        const suite = {...bundle, children: []}
        const childSuites: TestNode[] = []

        for (const node of asArray(bundle.children)) {
            (node.nodeType === 'Test Suite' ? childSuites : suite.children).push(node)
        }

        if (suite.children.length > 0) {
            suites.push(suite);
        }
        suites.push(...childSuites);
    }
    return suites
}

function computeChildren(children: TestNode[] | undefined) {
    let hasFailedRepetitions = false;
    let retries = 0;
    let className: string | undefined
    let lineNumber: number | undefined
    let failureMessage: string | undefined

    for (const child of asArray(children)) {
        switch (child.nodeType) {
            case 'Repetition':
                retries++;
                if (child.result == 'Failed') {
                    hasFailedRepetitions = true;
                }
                ({className, lineNumber, failureMessage} = computeChildren(child.children))
                break

            case 'Failure Message':
                const match = /(.+?):(\d+):\s*(.*)/g.exec(child.name)
                if (match) {
                    className = match[1]
                    lineNumber = Number(match[2])
                    failureMessage = match[3]

                } else {
                    failureMessage = child.name
                }
                break
        }
    }
    return {className, lineNumber, failureMessage, retries, hasFailedRepetitions}
}
