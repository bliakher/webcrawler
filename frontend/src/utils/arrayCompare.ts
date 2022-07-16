

export function areEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for(var element of a) {
        if (!b.includes(element)) return false;
    }
    return true;
}