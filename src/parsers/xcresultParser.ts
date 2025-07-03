import {lstatSync} from 'fs';
import {spawnSync} from "node:child_process";
import {Parser} from "./parser";
import {readFile} from "./readFile";
import {asArray, join, joinSeparator} from "../utils";
import {ParseResults, TestCase} from "../types";
import {resolveFile} from "./resolveFile";
import * as core from "@actions/core";
import {writeFileSync} from "node:fs";

type TestNode = {
    name: string,
    details?: string,
    result: 'Passed' | 'Failed' | 'Skipped',
    duration?: string,
    nodeType: 'Test Plan' | 'Unit test bundle' | 'Test Suite' | 'Test Case' | 'Repetition' | 'Failure Message',
    children?: TestNode[]
};

type XCResult = {
    "testNodes": TestNode[]
}

export const xcresultParser: Parser = {

    accept(filePath: string) {
        return filePath.endsWith('.xcresult.json') || isXCResultDir(filePath)
    },

    parse: async function (filePath: string) {
        if (isXCResultDir(filePath)) {
            const jsonFile = extractXcResultFile(filePath)
            if (!jsonFile) return null
            filePath = jsonFile;
        }

        const data: XCResult = await readFile(filePath);

        if (data?.testNodes) {
            const suites = asArray(data.testNodes)
                .flatMap(it => asArray(it.children))
                .flatMap(it => asArray(it.children))

            const result = new ParseResults();

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

                    const isFlaky = hasFailedRepetitions && outcome == 'passed'
                    if (isFlaky) {
                        flaky++
                        outcome = 'flaky'
                    }

                    if (outcome == 'failed' || isFlaky) {
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
                        took: testCase.duration,
                        outcome: outcome,
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

function isXCResultDir(filePath: string) {
    return filePath.endsWith('.xcresult') && lstatSync(filePath).isDirectory()
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

function extractXcResultFile(filePath: string) {
    const jsonFile = `${filePath}.json`

    const result = spawnSync("xcrun", ["xcresulttool", "get", "test-results", "tests", "--path", filePath], {
        encoding: "utf8",
    })
    if (result.error || result.stderr) {
        core.warning(`Failed to extract XCResults json file: ${join(result.error?.message, result.stderr)}`)
        return
    }
    core.debug('JSON output from xcresulttool:')
    core.debug(result.stdout)
    writeFileSync(jsonFile, result.stdout)
    return jsonFile
}
