package org.test.sample

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.RepeatedTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.fail

class FlakyFailingTestSuite {

    @Test
    fun failingTest() {
        fail("this test always fails")
    }

}
