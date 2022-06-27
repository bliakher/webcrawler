import { ExecutionData } from '../model/Execution';
import { RecordData, RecordEditable } from '../model/Record';
import { IRecord, IExecution, IRecordUpdate } from './model';
import { testRecords } from './testRecords';
import { testExecutions } from './testExecutions';

export interface APIResponse<T> {
    success: boolean;
    data: T | undefined; 
}

var records = testRecords.map(dataObj => new RecordData(dataObj));
var counter = 7;

const url = "http://localhost:8080";

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

    private static getHeaders() {
        return  {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    private static encodeBody(bodyObj: object) {
        return JSON.stringify(bodyObj);
    }

    private static getFetchParams(method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
        return {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
    }

    private static getFetchParamsWithBody(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body: object) {
        return {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: this.encodeBody(body)
        };
    }

    static async getRecords(): Promise<RecordData[] | null> {
        // return this.getTestRecordData();
        try {
            const response = await fetch(url + "/records", this.getFetchParams('GET'));
            const parsed = await response.json();
            if (!parsed.success) return null;
            var recordObjs: IRecord[] = parsed.records;
            return recordObjs.map(record => new RecordData(record));
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    static async getRecord(recordId: number): Promise<RecordData | null> {
        try {
            const response = await fetch(url + "/records/" + recordId, this.getFetchParams('GET'));
            const parsed = await response.json();
            return parsed.success ? new RecordData(parsed.record) : null;
            
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async createRecord(newRecord: RecordEditable): Promise<boolean> {
        // return this.testCreate();
        const body = this.transformRecordData(newRecord);
        try {
            const response = await fetch(url + "/records", this.getFetchParamsWithBody('POST', body));
            const parsed = await response.json();
            return parsed.success;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async updateRecord(recordId: number, record: RecordEditable): Promise<boolean> {
        // return this.testUpdate(recordId, recordData);
        const body = this.transformRecordData(record);
        try {
            const response = await fetch(url + "/records/" + recordId, this.getFetchParamsWithBody('PUT', body));
            const parsed = await response.json();
            console.log("update: ", parsed.success);
            return parsed.success;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async deleteRecord(recordId: number): Promise<boolean> {
        try {
            const response = await fetch(url + "/records/" + recordId, this.getFetchParams('DELETE'));
            const parsed = await response.json();
            return parsed.success;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    static async getExecutions(): Promise<ExecutionData[] | null> {
        // return this.getTestExecutionData();
        try {
            const response = await fetch(url + "/executions", this.getFetchParams('GET'));
            const parsed = await response.json();
            if (!parsed.success) return null;
            var execObjs: IExecution[] = parsed.executions;
            return execObjs.map(execution => new ExecutionData(execution));
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    static async getExecution(executionId: number): Promise<ExecutionData | null> {
        try {
            const response = await fetch(url + "/executions/" + executionId, this.getFetchParams('GET'));
            const parsed = await response.json();
            return parsed.success ? new ExecutionData(parsed.execution) : null;
            
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async createExecution(recordId: number): Promise<boolean> {
        const body = {"recordId": recordId };
        try {
            const response = await fetch(url + "/executions", this.getFetchParamsWithBody('POST', body));
            const parsed = await response.json();
            return parsed.success;
        } catch (error) {
            console.log();
            return false;
        }
    }

    private static transformRecordData(record: RecordEditable): IRecordUpdate {
        return {
            url: record.url,
            label: record.label,
            regEx: record.regEx,
            active: record.active,
            tags: record.tags,
            periodicity: record.periodicity.getMinutes()
        };
    }

    private static testCreate(): RecordData {
        var recordId = counter++;
        var record = RecordData.createEmptyRecord();
        record.id = recordId;
        records.push(record);
        return record;

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

    private static getTestExecutionData(): ExecutionData[] {
        return testExecutions.map(exec => new ExecutionData(exec));
    }
}