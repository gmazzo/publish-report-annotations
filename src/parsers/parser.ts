import {AnnotationProperties} from "@actions/core";

export type ParsedAnnotation = {
    message: string
    type: 'error' | 'warning' | 'notice'
} & AnnotationProperties;

export interface Parser {

    parse(this: void, filepath: string): Promise<ParsedAnnotation[] | null>

}
