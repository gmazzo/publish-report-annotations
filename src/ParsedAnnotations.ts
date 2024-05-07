import {AnnotationProperties} from "@actions/core";

type ParsedAnnotation = {
    message: string
    type: 'error' | 'warning' | 'notice'
    rawDetails?: string
} & AnnotationProperties;

export default class ParsedAnnotations {

    annotations: ParsedAnnotation[] = [];

    totals = { errors: 0, warnings: 0, notices: 0 };

    constructor(init?:Partial<ParsedAnnotations>) {
        Object.assign(this, init);
    }

    add(annotations: ParsedAnnotation | ParsedAnnotations) {
        if (annotations instanceof ParsedAnnotations) {
            this.annotations.push(...annotations.annotations);

            this.totals.errors += annotations.totals.errors;
            this.totals.warnings += annotations.totals.warnings;
            this.totals.notices += annotations.totals.notices;

        } else {
            this.annotations.push(annotations);

            switch (annotations.type) {
                case 'error':
                    this.totals.errors++;
                    break;
                case 'warning':
                    this.totals.warnings++;
                    break;
                default:
                    this.totals.notices++;
            }
        }
    }

}
