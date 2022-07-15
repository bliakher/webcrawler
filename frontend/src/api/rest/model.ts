
export interface IRecord {
    id: string;
    url: string;
    regEx: string;
    periodicity: number;
    label: string;
    active: boolean;
    tags: string[];
    lastExecTime: string;
    lastExecStatus: number;

}

export interface IRecordUpdate {
    url: string;
    regEx: string;
    periodicity: number;
    label: string;
    active: boolean;
    tags: string[];
}

export interface IExecution {
    id: string;
    recId: string;
    executionStatus: number;
    startTime: string;
    endTime: string;
    crawledSites: number;
}