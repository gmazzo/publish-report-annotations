import {ParseResults} from "../types";

const resolveFile = jest.fn().mockImplementation((file: string) => `<projectTestSrc>/${file}.kt`);

jest.mock("./resolveFile", () => ({
    resolveFile
}));

import {junitParser} from "./junitParser";

describe("junitParser", () => {

    test("given junit xml should obtain annotations", async () => {
        const data = await junitParser.parse("samples/TEST-org.test.sample.SampleTestSuite.xml");

        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                endLine: 16,
                    file: "<projectTestSrc>/org/test/sample/SampleTestSuite.kt",
                    message: "java.lang.AssertionError: this test has failed",
                    rawDetails: "java.lang.AssertionError: this test has failed\n\tat org.junit.Assert.fail(Assert.java:89)\n\tat org.test.sample.SampleTestSuite.a test that fails(SampleTestSuite.kt:16)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)\n\tat org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)\n\tat org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)\n\tat org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)\n\tat org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)\n\tat org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)\n\tat org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)\n\tat org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)\n\tat org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)\n\tat org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)\n\tat org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.ParentRunner.run(ParentRunner.java:413)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.runTestClass(JUnitTestClassExecutor.java:112)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:58)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:40)\n\tat org.gradle.api.internal.tasks.testing.junit.AbstractJUnitTestClassProcessor.processTestClass(AbstractJUnitTestClassProcessor.java:60)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.processTestClass(SuiteTestClassProcessor.java:52)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.processTestClass(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$2.run(TestWorker.java:176)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                startLine: 16,
                    title: "a test that fails",
                    type: "error"
                },
                {
                endLine: 21,
                    file: "<projectTestSrc>/org/test/sample/SampleTestSuite.kt",
                    message: "java.io.IOException: has been an I/O error",
                    rawDetails: "java.io.IOException: has been an I/O error\n\tat org.test.sample.SampleTestSuite.a test that throws an exception(SampleTestSuite.kt:21)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)\n\tat org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)\n\tat org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)\n\tat org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)\n\tat org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)\n\tat org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)\n\tat org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)\n\tat org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)\n\tat org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)\n\tat org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)\n\tat org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.ParentRunner.run(ParentRunner.java:413)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.runTestClass(JUnitTestClassExecutor.java:112)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:58)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:40)\n\tat org.gradle.api.internal.tasks.testing.junit.AbstractJUnitTestClassProcessor.processTestClass(AbstractJUnitTestClassProcessor.java:60)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.processTestClass(SuiteTestClassProcessor.java:52)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:568)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.processTestClass(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$2.run(TestWorker.java:176)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                startLine: 21,
                    title: "a test that throws an exception",
                    type: "error"
                }
            ],
            tests: {
                suites: [
                    {
                        name: "org.test.sample.SampleTestSuite",
                        count: 4,
                        passed: 1,
                        errors: 0,
                        failed: 2,
                        skipped: 1,
                        took: 0.002
                    }
                ],
                totals: {
                    count: 4,
                    passed: 1,
                    errors: 0,
                    failed: 2,
                    skipped: 1
                },
            },
            totals: {
                errors: 2,
                warnings: 0,
                others: 0
            }
        }));
    });

    test("given another junit xml should obtain annotations", async () => {
        const data = await junitParser.parse("samples/TEST-org.test.sample.AnotherTestSuite.xml");

        expect(data).toStrictEqual(new ParseResults({
            tests: {
                suites: [
                    {
                        errors: 0,
                        failed: 0,
                        name: "org.test.sample.AnotherTestSuite",
                        passed: 4,
                        skipped: 0,
                        count: 4,
                        took: 0.578
                    }
                ],
                totals: {
                    errors: 0,
                    failed: 0,
                    passed: 4,
                    skipped: 0,
                    count: 4
                }
            }
        }));
    });

    test("given a jest junit xml should obtain annotations", async () => {
        const data = await junitParser.parse("samples/TEST-jest.xml");

        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                endLine: undefined,
                    file: "<projectTestSrc>/junitParser given a jest junit xml should obtain annotations.kt",
                    message: "Error: expect(received).toStrictEqual(expected) // deep equality\n\nExpected: null\nReceived: []\n    at /Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:45:22\n    at Generator.next (<anonymous>)\n    at fulfilled (/Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:5:58)",
                    rawDetails: "Error: expect(received).toStrictEqual(expected) // deep equality\n\nExpected: null\nReceived: []\n    at /Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:45:22\n    at Generator.next (<anonymous>)\n    at fulfilled (/Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:5:58)",
                startLine: undefined,
                    title: "junitParser given a jest junit xml should obtain annotations",
                    type: "error"
                }
            ],
            tests: {
                suites: [
                    {
                        errors: 0,
                        failed: 0,
                        name: "asArray",
                        passed: 3,
                        skipped: 0,
                        count: 3,
                        took: 1.197
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "main",
                        passed: 3,
                        skipped: 0,
                        count: 3,
                        took: 1.651
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "readFile",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 1.72
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "processFile",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 1.738
                    },
                    {
                        errors: 0,
                        failed: 1,
                        name: "junitParser",
                        passed: 2,
                        skipped: 0,
                        count: 3,
                        took: 1.773
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "androidLintParser",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 2.801
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "checkstyleParser",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 2.806
                    },
                    {
                        errors: 0,
                        failed: 0,
                        name: "resolveFile",
                        passed: 5,
                        skipped: 0,
                        count: 5,
                        took: 3.985
                    }
                ],
                totals: {
                    errors: 0,
                    failed: 1,
                    passed: 17,
                    skipped: 0,
                    count: 18
                }
            },
            totals: {
                errors: 1,
                warnings: 0,
                others: 0
            },
        }));
    });

});
