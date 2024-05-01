package org.test.sample

import org.junit.Assert.fail
import org.junit.Ignore
import org.junit.Test
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
    @Ignore("not ready yet")
    fun `a test skipped`() {
    }

}
