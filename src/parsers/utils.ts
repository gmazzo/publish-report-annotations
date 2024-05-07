export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : [];
}

export function join(...values: (string | null | undefined)[]): string {
    return values.filter(it => it).join('\n');
}
