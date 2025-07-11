import * as core from "@actions/core";
import main from "./main";

function handleError(err: string | Error): void {
    console.error(err);
    core.setFailed(`Unhandled error: ${err}`);
}

process.on("unhandledRejection", handleError);
main().catch(handleError);
