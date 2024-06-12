package org.test.sample

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.RepeatedTest
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.fail

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FlakyTestSuite {

    private var times = 0

    @RepeatedTest(5, name = "flakyTest")
    fun flakyTest() {
        assertTrue(++times >= 3)
    }

    @RepeatedTest(3, name = "failingTest")
    fun failingTest() {
        fail("this test always fails")
    }

}
