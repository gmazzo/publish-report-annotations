package org.test.sample

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.RepeatedTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.fail
import java.io.File

class FlakyTestSuite {

    private val timesFile = File(checkNotNull(System.getenv("TIMES_FILE")))

    @Test
    fun flakyTest() {
        var times = if (timesFile.isFile) timesFile.readText().toInt() else 0

        try {
            assertTrue(++times >= 3, "times >= 3, actual $times")

        } finally {
            timesFile.writeText(times.toString())
        }
    }

}
