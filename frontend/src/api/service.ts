import { ExecutionData } from '../model/Execution';
import { RecordData } from '../model/Record';
import { IRecord, IExecution } from './model';
import { testRecords } from './testRecords';
import { testExecutions } from './testExecutions';

export interface APIResponse<T> {
    success: boolean;
    data: T | undefined; 
}

export class Service {

    // private static async fetchAPI<T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body: object)
    //     : Promise<APIResponse<T>> {

    //         try {
    //             const response = await fetch(path, {
    //                 method: method,
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(body)
    //             });
    //             const parsed = await response.json();
    //             return parsed;
    //         } catch (error) {
    //             return { success: false, data: undefined };
    //         }
    // }


    static async getRecords(): Promise<RecordData[] | null> {
        return this.getTestRecordData();
    }

    private static getTestRecordData(): RecordData[] {
        return testRecords.map(dataObj => new RecordData(dataObj));
    }

    static async getExecutions(): Promise<ExecutionData[] | null> {
        return this.getTestExecutionData();
    }

    private static getTestExecutionData(): ExecutionData[] {
        return testExecutions.map(exec => new ExecutionData(exec));
    }
}