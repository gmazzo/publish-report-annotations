package org.test.sample

import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import java.io.IOException

class SampleTestSuite {

    @Test
    fun `a test that passes`() {
    }

    @Test
    fun `a test that fails`() {
        fail("this test has failed")
    }

    @Test
    fun `a test that throws an exception`() {
        throw IOException("has been an I/O error")
    }

    @Test
    @Disabled("not ready yet")
    fun `a test skipped`() {
    }

}
