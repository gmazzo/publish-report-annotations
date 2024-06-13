import com.android.build.gradle.internal.lint.AndroidLintTask
import io.gitlab.arturbosch.detekt.Detekt

plugins {
    kotlin("android") version "1.9.23"
    id("com.android.application") version "8.3.0"
    id("io.gitlab.arturbosch.detekt") version "1.23.6"
    id("org.gradle.test-retry") version "1.5.9"
}

java.toolchain.languageVersion = JavaLanguageVersion.of(17)

android {
    namespace = "org.test.sample"
    compileSdk = 33

    lint.abortOnError = false
}

detekt.ignoreFailures = true

dependencies {
    implementation(platform("org.junit:junit-bom:5.10.2"))
    testImplementation("org.junit.jupiter:junit-jupiter-params")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
}

tasks {

    withType<Test>().configureEach {
        val timesFile = File(temporaryDir, ".times")

        useJUnitPlatform()
        ignoreFailures = true
        retry {
            maxRetries = 4
            filter.includeClasses.add("**.Flaky*")
        }

        environment("TIMES_FILE", timesFile.toRelativeString(projectDir))
        doFirst {
            timesFile.delete()
        }
    }

    val exportSamples by registering(Copy::class) {
        from(named<Test>("testDebugUnitTest").map { it.reports.junitXml.outputLocation }) { include("**.xml") }
        from(named<Detekt>("detektDebug").map { it.reports.xml.outputLocation }) { rename { "detekt-$it" } }
        from(named<AndroidLintTask>("lintReportDebug").map { it.xmlReportOutputFile })
        into(layout.projectDirectory.dir("../samples"))
        filter { it.replace("$rootDir/", "") }
    }

    build.configure { dependsOn(exportSamples) }
}
