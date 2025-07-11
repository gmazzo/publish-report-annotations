import { junitParser } from "./junitParser";
import { checkstyleParser } from "./checkstyleParser";
import { androidLintParser } from "./androidLintParser";
import { xcresultParser } from "./xcresultParser";

export const parsers = [junitParser, checkstyleParser, androidLintParser, xcresultParser];
