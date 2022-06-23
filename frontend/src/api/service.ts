import { ExecutionData } from '../model/Execution';
import { RecordData, RecordEditable } from '../model/Record';
import { IRecord, IExecution } from './model';
import { testRecords } from './testRecords';
import { testExecutions } from './testExecutions';

export interface APIResponse<T> {
    success: boolean;
    data: T | undefined; 
}

var records = testRecords.map(dataObj => new RecordData(dataObj));

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

    static async updateRecord(recordId: number, recordData: RecordEditable): Promise<void> {
        return this.testUpdate(recordId, recordData);
    }

    private static testUpdate(recordId: number, recordData: RecordEditable) {
        var record = RecordData.getRecordFrom(recordId, records);
        if (!record) return;
        record.label = recordData.label;
        record.url = recordData.url;
        record.tags = recordData.tags;
        record.active = recordData.active;
        record.periodicity = recordData.periodicity;
        record.regEx = recordData.regEx;
    }

    private static getTestRecordData(): RecordData[] {
        return records;
    }

    static async getExecutions(): Promise<ExecutionData[] | null> {
        return this.getTestExecutionData();
    }

    private static getTestExecutionData(): ExecutionData[] {
        return testExecutions.map(exec => new ExecutionData(exec));
    }
}