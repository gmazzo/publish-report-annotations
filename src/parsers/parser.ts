import {ParseResults} from "../types";

export interface Parser {

    parse(this: void, filepath: string): Promise<ParseResults | null>

}
