import {ParseResults} from "../types";

const resolveFile = jest.fn().mockImplementation((file: string) => `<projectTestSrc>/${file}.kt`);
const fileFilter = jest.fn().mockReturnValue(true);

jest.mock("./resolveFile", () => ({
    resolveFile
}));

const config = {
    detectFlakyTests: false,
};
jest.mock("../config", () => (config));

import {junitParser} from "./junitParser";

describe("junitParser", () => {

    beforeEach(() => {
        config.detectFlakyTests = false;
    });

    test("given junit xml should obtain annotations", async () => {
        const data = await junitParser.parse("samples/TEST-org.test.sample.SampleTestSuite.xml", fileFilter);

        expect(fileFilter).not.toHaveBeenCalled();
        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                    endLine: 16,
                    file: "<projectTestSrc>/org/test/sample/SampleTestSuite.kt",
                    message: "org.opentest4j.AssertionFailedError: this test has failed",
                    rawDetails: "org.opentest4j.AssertionFailedError: this test has failed\n\tat org.junit.jupiter.api.AssertionUtils.fail(AssertionUtils.java:42)\n\tat org.junit.jupiter.api.Assertions.fail(Assertions.java:150)\n\tat org.junit.jupiter.api.AssertionsKt.fail(Assertions.kt:27)\n\tat org.junit.jupiter.api.AssertionsKt.fail$default(Assertions.kt:26)\n\tat org.test.sample.SampleTestSuite.a test that fails(SampleTestSuite.kt:16)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    startLine: 16,
                    title: "a test that fails()",
                    severity: "error"
                },
                {
                    endLine: 21,
                    file: "<projectTestSrc>/org/test/sample/SampleTestSuite.kt",
                    message: "java.io.IOException: has been an I/O error",
                    rawDetails: "java.io.IOException: has been an I/O error\n\tat org.test.sample.SampleTestSuite.a test that throws an exception(SampleTestSuite.kt:21)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    startLine: 21,
                    title: "a test that throws an exception()",
                    severity: "error"
                }
            ],
            tests: {
                suites: [
                    {
                        name: "org.test.sample.SampleTestSuite",
                        count: 4,
                        passed: 1,
                        failed: 2,
                        skipped: 1,
                        took: 0.004
                    }
                ],
                totals: {
                    count: 4,
                    passed: 1,
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
        const data = await junitParser.parse("samples/TEST-org.test.sample.AnotherTestSuite.xml", fileFilter);

        expect(fileFilter).not.toHaveBeenCalled();
        expect(data).toStrictEqual(new ParseResults({
            tests: {
                suites: [
                    {
                        failed: 0,
                        name: "org.test.sample.AnotherTestSuite",
                        passed: 4,
                        skipped: 0,
                        count: 4,
                        took: 0.506
                    }
                ],
                totals: {
                    failed: 0,
                    passed: 4,
                    skipped: 0,
                    count: 4
                }
            }
        }));
    });

    test.each([[false], [true]])("given a junit xml with retries should process it correctly [detectFlakyTests=%p]", async (detectFlakyTests) => {
        config.detectFlakyTests = detectFlakyTests;

        const data = await junitParser.parse("samples/TEST-org.test.sample.FlakyTestSuite.xml", fileFilter);

        expect(data).toStrictEqual(detectFlakyTests ? new ParseResults({
            annotations: [
                {
                    endLine: 19,
                    file: "<projectTestSrc>/org/test/sample/FlakyTestSuite.kt",
                    message: "org.opentest4j.AssertionFailedError: times >= 3, actual 2 ==> expected: <true> but was: <false>",
                    rawDetails: "org.opentest4j.AssertionFailedError: times >= 3, actual 2 ==> expected: <true> but was: <false>\n\tat org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)\n\tat org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)\n\tat org.junit.jupiter.api.AssertTrue.failNotTrue(AssertTrue.java:63)\n\tat org.junit.jupiter.api.AssertTrue.assertTrue(AssertTrue.java:36)\n\tat org.junit.jupiter.api.Assertions.assertTrue(Assertions.java:214)\n\tat org.test.sample.FlakyTestSuite.flakyTest(FlakyTestSuite.kt:19)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    severity: "warning",
                    startLine: 19,
                    title: "(❗Flaky) flakyTest()"
                }
            ],
            checks: {
                checks: [],
                totals: {
                    count: 0,
                    errors: 0,
                    others: 0,
                    warnings: 0
                }
            },
            tests: {
                suites: [
                    {
                        count: 1,
                        failed: 0,
                        name: "org.test.sample.FlakyTestSuite",
                        passed: 1,
                        skipped: 0,
                        took: 1.295,
                        flaky: 1
                    }
                ],
                totals: {
                    count: 1,
                    failed: 0,
                    passed: 1,
                    skipped: 0,
                    flaky: 1
                }
            },
            totals: {
                errors: 0,
                others: 0,
                warnings: 1
            }
        }) : new ParseResults({
            annotations: [
                {
                    endLine: 19,
                    file: "<projectTestSrc>/org/test/sample/FlakyTestSuite.kt",
                    message: "org.opentest4j.AssertionFailedError: times >= 3, actual 1 ==> expected: <true> but was: <false>",
                    rawDetails: "org.opentest4j.AssertionFailedError: times >= 3, actual 1 ==> expected: <true> but was: <false>\n\tat org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)\n\tat org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)\n\tat org.junit.jupiter.api.AssertTrue.failNotTrue(AssertTrue.java:63)\n\tat org.junit.jupiter.api.AssertTrue.assertTrue(AssertTrue.java:36)\n\tat org.junit.jupiter.api.Assertions.assertTrue(Assertions.java:214)\n\tat org.test.sample.FlakyTestSuite.flakyTest(FlakyTestSuite.kt:19)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    severity: "error",
                    startLine: 19,
                    title: "flakyTest()"
                },
                {
                    endLine: 19,
                    file: "<projectTestSrc>/org/test/sample/FlakyTestSuite.kt",
                    message: "org.opentest4j.AssertionFailedError: times >= 3, actual 2 ==> expected: <true> but was: <false>",
                    rawDetails: "org.opentest4j.AssertionFailedError: times >= 3, actual 2 ==> expected: <true> but was: <false>\n\tat org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)\n\tat org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)\n\tat org.junit.jupiter.api.AssertTrue.failNotTrue(AssertTrue.java:63)\n\tat org.junit.jupiter.api.AssertTrue.assertTrue(AssertTrue.java:36)\n\tat org.junit.jupiter.api.Assertions.assertTrue(Assertions.java:214)\n\tat org.test.sample.FlakyTestSuite.flakyTest(FlakyTestSuite.kt:19)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    severity: "error",
                    startLine: 19,
                    title: "flakyTest()"
                }
            ],
            checks: {
                checks: [],
                totals: {
                    count: 0,
                    errors: 0,
                    others: 0,
                    warnings: 0
                }
            },
            tests: {
                suites: [
                    {
                        count: 3,
                        failed: 2,
                        name: "org.test.sample.FlakyTestSuite",
                        passed: 1,
                        skipped: 0,
                        took: 1.295
                    }
                ],
                totals: {
                    count: 3,
                    failed: 2,
                    passed: 1,
                    skipped: 0
                }
            },
            totals: {
                errors: 2,
                others: 0,
                warnings: 0
            }
        }));
    });

    test("given a junit xml with retries that always fails, should process it correctly", async () => {
        config.detectFlakyTests = true;

        const data = await junitParser.parse("samples/TEST-org.test.sample.FlakyFailingTestSuite.xml", fileFilter);

        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                    endLine: 13,
                    file: "<projectTestSrc>/org/test/sample/FlakyFailingTestSuite.kt",
                    message: "org.opentest4j.AssertionFailedError: this test always fails",
                    rawDetails: "org.opentest4j.AssertionFailedError: this test always fails\n\tat org.junit.jupiter.api.AssertionUtils.fail(AssertionUtils.java:42)\n\tat org.junit.jupiter.api.Assertions.fail(Assertions.java:150)\n\tat org.junit.jupiter.api.AssertionsKt.fail(Assertions.kt:27)\n\tat org.junit.jupiter.api.AssertionsKt.fail$default(Assertions.kt:26)\n\tat org.test.sample.FlakyFailingTestSuite.failingTest(FlakyFailingTestSuite.kt:13)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.junit.platform.commons.util.ReflectionUtils.invokeMethod(ReflectionUtils.java:728)\n\tat org.junit.jupiter.engine.execution.MethodInvocation.proceed(MethodInvocation.java:60)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$ValidatingInvocation.proceed(InvocationInterceptorChain.java:131)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.intercept(TimeoutExtension.java:156)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestableMethod(TimeoutExtension.java:147)\n\tat org.junit.jupiter.engine.extension.TimeoutExtension.interceptTestMethod(TimeoutExtension.java:86)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker$ReflectiveInterceptorCall.lambda$ofVoidMethod$0(InterceptingExecutableInvoker.java:103)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.lambda$invoke$0(InterceptingExecutableInvoker.java:93)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain$InterceptedInvocation.proceed(InvocationInterceptorChain.java:106)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.proceed(InvocationInterceptorChain.java:64)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.chainAndInvoke(InvocationInterceptorChain.java:45)\n\tat org.junit.jupiter.engine.execution.InvocationInterceptorChain.invoke(InvocationInterceptorChain.java:37)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:92)\n\tat org.junit.jupiter.engine.execution.InterceptingExecutableInvoker.invoke(InterceptingExecutableInvoker.java:86)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$invokeTestMethod$7(TestMethodTestDescriptor.java:218)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.invokeTestMethod(TestMethodTestDescriptor.java:214)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:139)\n\tat org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.execute(TestMethodTestDescriptor.java:69)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:151)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat java.base/java.util.ArrayList.forEach(Unknown Source)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:155)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:141)\n\tat org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:139)\n\tat org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:138)\n\tat org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)\n\tat org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)\n\tat org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:107)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:88)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:54)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:67)\n\tat org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:52)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:114)\n\tat org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:86)\n\tat org.junit.platform.launcher.core.DefaultLauncherSession$DelegatingLauncher.execute(DefaultLauncherSession.java:86)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.processAllTestClasses(JUnitPlatformTestClassProcessor.java:119)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor$CollectAllTestClassesExecutor.access$000(JUnitPlatformTestClassProcessor.java:94)\n\tat org.gradle.api.internal.tasks.testing.junitplatform.JUnitPlatformTestClassProcessor.stop(JUnitPlatformTestClassProcessor.java:89)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.stop(SuiteTestClassProcessor.java:62)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)\n\tat java.base/java.lang.reflect.Method.invoke(Unknown Source)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat jdk.proxy1/jdk.proxy1.$Proxy2.stop(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$3.run(TestWorker.java:193)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                    severity: "error",
                    startLine: 13,
                    title: "failingTest()"
                }
            ],
            checks: {
                checks: [],
                totals: {
                    count: 0,
                    errors: 0,
                    others: 0,
                    warnings: 0
                }
            },
            tests: {
                suites: [
                    {
                        count: 1,
                        failed: 1,
                        name: "org.test.sample.FlakyFailingTestSuite",
                        passed: 0,
                        skipped: 0,
                        took: 2.07,
                        flaky: 0
                    }
                ],
                totals: {
                    count: 1,
                    failed: 1,
                    passed: 0,
                    skipped: 0,
                    flaky: 0
                }
            },
            totals: {
                errors: 1,
                others: 0,
                warnings: 0
            }
        }));
    });

    test("given a jest junit xml should obtain annotations", async () => {
        const data = await junitParser.parse("samples/TEST-jest.xml", fileFilter);

        expect(fileFilter).not.toHaveBeenCalled();
        expect(data).toStrictEqual(new ParseResults({
            annotations: [
                {
                    endLine: undefined,
                    file: "<projectTestSrc>/junitParser given a jest junit xml should obtain annotations.kt",
                    message: "Error: expect(received).toStrictEqual(expected) // deep equality\n\nExpected: null\nReceived: []\n    at /Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:45:22\n    at Generator.next (<anonymous>)\n    at fulfilled (/Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:5:58)",
                    rawDetails: "Error: expect(received).toStrictEqual(expected) // deep equality\n\nExpected: null\nReceived: []\n    at /Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:45:22\n    at Generator.next (<anonymous>)\n    at fulfilled (/Users/gmazzola/Documents/publish-report-annotations/src/parsers/junitParser.test.ts:5:58)",
                    startLine: undefined,
                    title: "junitParser given a jest junit xml should obtain annotations",
                    severity: "error"
                }
            ],
            tests: {
                suites: [
                    {
                        failed: 0,
                        name: "asArray",
                        passed: 3,
                        skipped: 0,
                        count: 3,
                        took: 1.197
                    },
                    {
                        failed: 0,
                        name: "main",
                        passed: 3,
                        skipped: 0,
                        count: 3,
                        took: 1.651
                    },
                    {
                        failed: 0,
                        name: "readFile",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 1.72
                    },
                    {
                        failed: 0,
                        name: "processFile",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 1.738
                    },
                    {
                        failed: 1,
                        name: "junitParser",
                        passed: 2,
                        skipped: 0,
                        count: 3,
                        took: 1.773
                    },
                    {
                        failed: 0,
                        name: "androidLintParser",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 2.801
                    },
                    {
                        failed: 0,
                        name: "checkstyleParser",
                        passed: 1,
                        skipped: 0,
                        count: 1,
                        took: 2.806
                    },
                    {
                        failed: 0,
                        name: "resolveFile",
                        passed: 5,
                        skipped: 0,
                        count: 5,
                        took: 3.985
                    }
                ],
                totals: {
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
