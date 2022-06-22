

export enum ExecutionStatus {
    Waiting,
    Started,
    Ended,
    Error
}

export class Execution {

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