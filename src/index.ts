import * as core from "@actions/core";
import main from "./main";

(async function run() {
    try {
        await main()

    } catch (error) {
        if (error instanceof Error) core.setFailed(error)
        else core.setFailed(JSON.stringify(error))
    }
})()
