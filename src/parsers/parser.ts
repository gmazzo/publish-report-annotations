import {AnnotationProperties} from "@actions/core";

export type ParsedAnnotation = {
    message: string
    type: 'error' | 'warning' | 'notice'
    raw_details?: string
} & AnnotationProperties;

export interface Parser {

    parse(this: void, filepath: string): Promise<ParsedAnnotation[] | null>

}
