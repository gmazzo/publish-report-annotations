import {ParseResults} from "../types";

export type FileFilter = (file?: string) => boolean;

export interface Parser {

    parse(this: void, filePath: string, fileFilter: FileFilter): Promise<ParseResults | null>

}
