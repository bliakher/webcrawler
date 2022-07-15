import { IRecord } from '../api/rest/model'; 
import { ExecutionStatus, ExecutionData } from './Execution';


export type RecordCallback = (recordId: number) => void;

export class RecordData {

    id: number;
    url: string;
    regEx: string;
    periodicity: Periodicity;
    label: string;
    active: boolean;
    tags: string[];
    lastExecTime: Date | null;
    lastExecStatus: ExecutionStatus;
    constructor(recordObj: IRecord) {
        this.id = parseInt(recordObj.id);
        this.url = recordObj.url;
        this.regEx = recordObj.regEx;
        this.periodicity = new Periodicity(recordObj.periodicity);
        this.label = recordObj.label;
        this.active = recordObj.active;
        this.tags = recordObj.tags;
        this.lastExecTime = recordObj.lastExecTime ? new Date(recordObj.lastExecTime) : null;
        this.lastExecStatus = ExecutionData.getStatus(recordObj.lastExecStatus);
    }

    static compareByUrl(rec1: RecordData, rec2: RecordData) {
        return rec1.url.localeCompare(rec2.url);
    }

    static compareByExecTime(rec1: RecordData, rec2: RecordData) {
        if (rec1.lastExecTime === null) return -1;
        if (rec2.lastExecTime === null) return 1;
        if (rec1.lastExecTime === rec2.lastExecTime) return 0;
        if (rec1.lastExecTime > rec2.lastExecTime) return 1;
        return -1;
    }
    static getRecordFrom(recordId: number, records: RecordData[]): RecordData | null {
        var found = records?.filter(record => record.id === recordId) ?? [];
        return found.length > 0 ? found[0] : null;
    }

    static createEmptyRecord(): RecordData {
        //TODO: ??? how is created in the database
        return new RecordData({
            id: "", // invalid id
            url: "",
            label: "",
            regEx: "",
            periodicity: 0,
            active: false, 
            tags: [],
            lastExecTime: "",
            lastExecStatus: 0
        })
    }
}

export interface RecordEditable {
    url: string;
    regEx: string;
    periodicity: Periodicity;
    label: string;
    active: boolean;
    tags: string[];
}

export class Periodicity {
    days: number;
    hours: number;
    minutes: number;
    constructor(minutes: number) {
        this.days = Math.floor(minutes / 1440);
        this.hours = Math.floor( (minutes % 1440) / 60 );
        this.minutes = minutes % 60 ;
    }

    getMinutes(): number {
        return this.days * 1440 + this.hours * 60 + this.minutes;
    }

    private padWithZero(num: number): string {
        return (num < 10 ? '0' : '') + num.toString();
    }
    toString(): string {
        var days = this.padWithZero(this.days);
        var hours = this.padWithZero(this.hours);
        var minutes = this.padWithZero(this.minutes);
        return days + '-' + hours + '-' + minutes;
    }
}