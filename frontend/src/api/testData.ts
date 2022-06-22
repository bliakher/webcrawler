import { IRecord } from '../api/model';

export const testData: IRecord[] = [
    {
        id: 5,
        label: "E",
        url: "http",
        tags: ["tag1", "tag2"],
        regEx: "*",
        periodicity: 1800,
        active: true,
        lastExecTime: "2022-06-22T14:38:10",
        lastExecStatus: 2
    },
    {
        id: 1,
        label: "A",
        url: "http",
        tags: ["tag1", "tag2"],
        regEx: "*",
        periodicity: 90,
        active: true,
        lastExecTime: "2019-01-01T00:00:00",
        lastExecStatus: 1
    },
    {
        id: 3,
        label: "C",
        url: "http",
        tags: ["tag2"],
        regEx: "*",
        periodicity: 120,
        active: true,
        lastExecTime: "2022-04-22T14:38:10",
        lastExecStatus: 0
    },
    {
        id: 2,
        label: "B",
        url: "http",
        tags: ["tag1"],
        regEx: "*",
        periodicity: 90,
        active: true,
        lastExecTime: "2022-03-22T14:38:10",
        lastExecStatus: 1
    },
    
    {
        id: 6,
        label: "F",
        url: "http",
        tags: ["tag1"],
        regEx: "*",
        periodicity: 90,
        active: true,
        lastExecTime: "2022-07-22T14:38:10",
        lastExecStatus: 3
    },
    {
        id: 4,
        label: "D",
        url: "http",
        tags: [],
        regEx: "*",
        periodicity: 90,
        active: true,
        lastExecTime: "2022-05-22T14:38:10",
        lastExecStatus: 0
    },
    
    

]