import {Config, ParseResults} from "../types";

export type FileFilter = (file?: string) => boolean;

export interface Parser<Type> {

    process(this: void, data: Type, config: Config): Promise<ParseResults | null>

}
