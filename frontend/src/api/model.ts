
export interface IRecord {
    id: number;
    url: string;
    regEx: string;
    periodicity: number;
    label: string;
    active: boolean;
    tags: string[];
    lastExecTime: string;
    lastExecStatus: number;

}

export interface IExecution {
    id: number;
    recId: number;
    executionStatus: number;
    startTime: string;
    endTime: string;
    crawledSites: number;
}