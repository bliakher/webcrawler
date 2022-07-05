import { webpage } from "../model/webpage"
import { execution } from "../model/execution";
import { node } from "../model/node";

export function parseResultToWebpage(result: any): webpage {
    return {
        id: result.id,
        regEx: result.regex,
        label: result.label,
        periodicity: result.periodicity,
        tags: result.tags,
        active: result.active,
        url: result.url,
        lastExecStatus: result.executionStatus,
        lastExecTime: result.executionTime
    }
}

export function parseResultToExecution(result: any): execution {
    return {
        id: result.id,
        recId: result.webpage_id,
        executionStatus: result.executionstatus,
        startTime: result.starttime,
        endTime: result.endtime,
        crawledSites: result.crawledsites,
    }
}

export function parseResultToNode(result : any) : node {
    return {
        id : result.id,
        crawlTime : result.crawl_time,
        ownerId : result.webpage_id,
        title : result.title,
        url : result.url
    }
}