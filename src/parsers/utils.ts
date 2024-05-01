export function asArray<Value>(value: Value | Value[] | undefined): Value[] {
    return value ? Array.isArray(value) ? value : [value] : []
}
