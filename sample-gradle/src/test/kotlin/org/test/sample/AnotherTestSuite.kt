package org.test.sample

import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import java.lang.Math.random
import java.lang.Thread.sleep

class AnotherTestSuite {

    @ParameterizedTest(name = "aTest[maxDuration={0}]")
    @ValueSource(ints = [100, 200, 300, 400])
    fun aTest(maxDuration: Long) {
        sleep((random() * maxDuration).toLong())
    }

}
