export interface execution {
    id : bigint,
    recId : bigint, 
    executionStatus : number,
    startTime : Date,
    endTime : Date,
    crawledSites : number
}

export interface startingExecution {
    executionStatus : number,
    startTime : Date
    crawledSites : number,
}

export const nullexecution : execution = {
    id : BigInt(0),
    crawledSites : 0,
    endTime : null,
    startTime : null,
    executionStatus : -1,
    recId : BigInt(0)
}