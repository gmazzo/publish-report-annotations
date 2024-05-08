import ParsedAnnotations from "../ParsedAnnotations";

export interface Parser {

    parse(this: void, filepath: string): Promise<ParsedAnnotations | null>

}
