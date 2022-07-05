export interface webpage {
    id: bigint;
    url: string,
    regEx: string,
    periodicity: number,
    label: string,
    tags: Array<string>,
    active: boolean,
    lastExecTime?: string,
    lastExecStatus?: number
}

export interface graphQLWebPage {
    identifier : bigint,
    label : string,
    url : string, 
    regexp : string,
    tags : string[],
    active : boolean
}

export const nullpage: webpage = {
    id: BigInt(0),
    active: false, label: "", periodicity: 0, regEx: "", tags: [], url: ""
}