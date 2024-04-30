import {readFile} from "./readFile";

describe("readFile", () => {

    test("should return parsed JSON file", async () => {
        const data = await readFile("samples/detekt.sarif")

        expect(data?.runs?.length).toBe(1)
        expect(data?.runs[0].results).toStrictEqual([
            {
                "level": "warning",
                "locations": [
                    {
                        "physicalLocation": {
                            "artifactLocation": {
                                "uri": "file:../android-jacoco-aggregated-demo/demo-project/domain/src/main/kotlin/MyUseCase.kt"
                            },
                            "region": {
                                "endColumn": 27,
                                "endLine": 1,
                                "startColumn": 1,
                                "startLine": 1
                            }
                        }
                    }
                ],
                "message": {
                    "text": "The package declaration does not match the actual file location."
                },
                "ruleId": "detekt.naming.InvalidPackageDeclaration"
            },
            {
                "level": "warning",
                "locations": [
                    {
                        "physicalLocation": {
                            "artifactLocation": {
                                "uri": "file:../android-jacoco-aggregated-demo/demo-project/domain/src/main/kotlin/MyUseCase.kt"
                            },
                            "region": {
                                "endColumn": 20,
                                "endLine": 5,
                                "startColumn": 9,
                                "startLine": 5
                            }
                        }
                    }
                ],
                "message": {
                    "text": "doSomething is returning a constant. Prefer declaring a constant instead."
                },
                "ruleId": "detekt.style.FunctionOnlyReturningConstant"
            }
        ])
    })

    test("should return parsed XML file as JSON", async () => {
        const data = await readFile("samples/junit.xml")

        expect(data).toStrictEqual({
            "testsuite": {
                "_attrs": {
                    "errors": "0",
                    "failures": "1",
                    "hostname": "gmazzola-mac.local",
                    "name": "com.example.myapplication.ExampleUnitTest",
                    "skipped": "1",
                    "tests": "3",
                    "time": "0.004",
                    "timestamp": "2024-04-30T07:58:52"
                },
                "properties": true,
                "system-err": true,
                "system-out": true,
                "testcase": [
                    {
                        "_attrs": {
                            "classname": "com.example.myapplication.ExampleUnitTest",
                            "name": "ignored_test",
                            "time": "0.0"
                        },
                        "skipped": true
                    },
                    {
                        "_attrs": {
                            "classname": "com.example.myapplication.ExampleUnitTest",
                            "name": "addition_isCorrect",
                            "time": "0.001"
                        }
                    },
                    {
                        "_attrs": {
                            "classname": "com.example.myapplication.ExampleUnitTest",
                            "name": "failing_test",
                            "time": "0.002"
                        },
                        "failure": {
                            "_text": "java.lang.AssertionError: this is a sample failure\n\tat org.junit.Assert.fail(Assert.java:89)\n\tat com.example.myapplication.ExampleUnitTest.failing_test(ExampleUnitTest.kt:21)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:566)\n\tat org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)\n\tat org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)\n\tat org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)\n\tat org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)\n\tat org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)\n\tat org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)\n\tat org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)\n\tat org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)\n\tat org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)\n\tat org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)\n\tat org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)\n\tat org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)\n\tat org.junit.runners.ParentRunner.run(ParentRunner.java:413)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.runTestClass(JUnitTestClassExecutor.java:112)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:58)\n\tat org.gradle.api.internal.tasks.testing.junit.JUnitTestClassExecutor.execute(JUnitTestClassExecutor.java:40)\n\tat org.gradle.api.internal.tasks.testing.junit.AbstractJUnitTestClassProcessor.processTestClass(AbstractJUnitTestClassProcessor.java:60)\n\tat org.gradle.api.internal.tasks.testing.SuiteTestClassProcessor.processTestClass(SuiteTestClassProcessor.java:52)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:566)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:36)\n\tat org.gradle.internal.dispatch.ReflectionDispatch.dispatch(ReflectionDispatch.java:24)\n\tat org.gradle.internal.dispatch.ContextClassLoaderDispatch.dispatch(ContextClassLoaderDispatch.java:33)\n\tat org.gradle.internal.dispatch.ProxyDispatchAdapter$DispatchingInvocationHandler.invoke(ProxyDispatchAdapter.java:94)\n\tat com.sun.proxy.$Proxy5.processTestClass(Unknown Source)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker$2.run(TestWorker.java:176)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.executeAndMaintainThreadName(TestWorker.java:129)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:100)\n\tat org.gradle.api.internal.tasks.testing.worker.TestWorker.execute(TestWorker.java:60)\n\tat org.gradle.process.internal.worker.child.ActionExecutionWorker.execute(ActionExecutionWorker.java:56)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:113)\n\tat org.gradle.process.internal.worker.child.SystemApplicationClassLoaderWorker.call(SystemApplicationClassLoaderWorker.java:65)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.run(GradleWorkerMain.java:69)\n\tat worker.org.gradle.process.internal.worker.GradleWorkerMain.main(GradleWorkerMain.java:74)\n",
                            "_attrs": {
                                "message": "java.lang.AssertionError: this is a sample failure",
                                "type": "java.lang.AssertionError"
                            }
                        }
                    }
                ]
            }
        })
    })

})
