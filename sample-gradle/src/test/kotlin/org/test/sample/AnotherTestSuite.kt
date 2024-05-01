package org.test.sample

import org.junit.Assert.fail
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.Parameterized
import org.junit.runners.Parameterized.Parameters
import java.io.IOException
import java.lang.Math.random
import java.lang.Thread.sleep

@RunWith(Parameterized::class)
class AnotherTestSuite(private val maxDuration: Long) {

    @Test
    fun aTest() {
        sleep((random() * maxDuration).toLong())
    }

    companion object {

        @Parameters
        @JvmStatic
        fun params() = listOf(
            arrayOf(100),
            arrayOf(200),
            arrayOf(300),
            arrayOf(400),
        )

    }

}
