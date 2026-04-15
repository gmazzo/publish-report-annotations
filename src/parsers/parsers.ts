import { junitParser } from "./junitParser";
import { checkstyleParser } from "./checkstyleParser";
import { androidLintParser } from "./androidLintParser";
import { xcresultParser } from "./xcresultParser";
import { xcActivityLogParser } from "./xcActivityLogParser";

export const parsers = [junitParser, checkstyleParser, androidLintParser, xcActivityLogParser, xcresultParser];
