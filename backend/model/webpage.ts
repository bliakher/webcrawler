export interface webpage {
    id: bigint;
    url: string,
    regEx: string,
    periodicity: number,
    label: string,
    tags: Array<string>,
    active: boolean,
    executionTime?: string,
    executionStatus?: number
}

export const nullpage: webpage = {
    id: BigInt(0),
    active: false, label: "", periodicity: 0, regEx: "", tags: [], url: ""
}