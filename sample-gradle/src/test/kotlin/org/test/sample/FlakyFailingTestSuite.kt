package org.test.sample

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.RepeatedTest
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.fail

class FlakyFailingTestSuite {

    @RepeatedTest(3, name = "failingTest")
    fun failingTest() {
        fail("this test always fails")
    }

}
