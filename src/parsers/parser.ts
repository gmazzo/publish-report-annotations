import {Config, ParseResults} from "../types";

export type FileFilter = (file?: string) => boolean;

export interface Parser {

    parse(this: void, filePath: string, config: Config): Promise<ParseResults | null>

}
