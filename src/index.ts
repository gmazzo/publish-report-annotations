import * as core from "@actions/core";
import main from "./main";

main().catch(core.setFailed);
