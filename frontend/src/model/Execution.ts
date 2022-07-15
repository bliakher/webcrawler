import { updateExternalModuleReference } from "typescript";
import { IExecution } from "../api/rest/model";

export enum ExecutionStatus {
    Waiting,
    Started,
    Ended,
    Error, 
    Unknown
}

export class ExecutionData {
    id: number;
    recordId: number;
    status: ExecutionStatus;
    startTime: Date | null;
    endTime: Date | null;
    crawledSites: number;

    constructor(execObj: IExecution) {
        this.id = execObj.id;
        this.recordId = execObj.recId;
        this.status = ExecutionData.getStatus(execObj.executionStatus);
        this.startTime = execObj.startTime ? new Date(execObj.startTime) : null;
        this.endTime = execObj.endTime ? new Date(execObj.endTime) : null;
        this.crawledSites = execObj.crawledSites;
    }

    static getStatus(statusCode: number): ExecutionStatus {
        if (!statusCode) return ExecutionStatus.Unknown;
        switch(statusCode) {
            case 0:
                return ExecutionStatus.Waiting;
            case 1:
                return ExecutionStatus.Started;
            case 2:
                return ExecutionStatus.Ended;
            default:
                return ExecutionStatus.Error;
        }
    }

    static getStatusString(status: ExecutionStatus): string {
        switch(status) {
            case ExecutionStatus.Waiting:
                return 'WAITING';
            case ExecutionStatus.Started:
                return 'STARTED';
            case ExecutionStatus.Ended:
                return 'ENDED';
            case ExecutionStatus.Error:
                return 'ERROR';
            case ExecutionStatus.Unknown:
                return 'UNKNOWN';
        }
    }
}