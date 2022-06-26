export interface webpage {
    id: bigint;
    url: string,
    regex: string,
    periodicity: number,
    label: string,
    tags: Array<string>,
    active: boolean,
}

export const nullpage: webpage = {
    id: BigInt(0),
    active: false, label: "", periodicity: 0, regex: "", tags: [], url: ""
}