import { IExecution } from "../api/model";

export enum ExecutionStatus {
    Waiting,
    Started,
    Ended,
    Error
}

export class Execution {
    id: number;
    recordId: number;
    status: ExecutionStatus;
    startTime: Date | null;
    endTime: Date | null;

    constructor(execObj: IExecution) {
        this.id = execObj.id;
        this.recordId = execObj.recId;
        this.status = Execution.getStatus(execObj.executionStatus);
        this.startTime = execObj.startTime ? new Date(execObj.startTime) : null;
        this.endTime = execObj.endTime ? new Date(execObj.endTime) : null;
    }

    static getStatus(statusCode: number): ExecutionStatus {
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
        }
    }
}