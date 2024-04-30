import {AnnotationProperties} from "@actions/core";

export type ParsedAnnotation = {
    message: string
    type: 'failure' | 'warning' | 'notice'
    raw_details?: string
} & AnnotationProperties

export interface Parser {

    parse(filepath: string): Promise<ParsedAnnotation[] | null>

}
