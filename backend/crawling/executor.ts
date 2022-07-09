import { DatabaseManager } from "../dbservice/databaseManager";
import { execution, startingExecution } from "../model/execution";
import { node } from "../model/node";
import { webpage } from "../model/webpage";

export class Executor {
    private static instance: Executor = null;

    private db: DatabaseManager;
    private records: webpage[];

    private constructor() {
        this.db = DatabaseManager.getManager();
        this.db.removeUnfinishedExecutions().then(() => {
            this.loadAndPlanAllExecutionsOnStart();
        }).catch((error) => {
            console.log(error);
        })
    }

    public static getExecutor(): Executor {
        if (!Executor.instance) {
            Executor.instance = new Executor();
        }
        return Executor.instance;
    }

    private async loadAndPlanAllExecutionsOnStart() {
        this.records = await this.db.getWebsitesWithLatestExecutionStop();
        for (let record of this.records) {
            let nextStart = new Date(Date.parse(record.lastExecTime) + (record.periodicity * 60 * 1000));

            if (nextStart.getTime() <= Date.now()) {
                this.startImmidiateExecution(record);
            } else {
                this.planExecution(record);
            }
        }
    }

    private async startImmidiateExecution(record: webpage) {
        let exec : execution = await this.logNewExecution(record);
        //TODO spawn thread with crawler
        console.log(`request for starting execution now has been processed ${record.id}`);
    }

    private async planExecution(record: webpage) {
        
    }

    private async logNewExecution(record: webpage) : Promise<execution> {
        let exec: startingExecution = {
            recId: record.id,
            crawledSites: 0,
            executionStatus: 1,
            startTime: new Date(Date.now())
        };
        let execId = await this.db.logNewExecution(exec);
        return await this.db.getExecution(execId);
    }
}

function resolveCrawledGraph(nodes: node[], record: webpage, exec: execution) {
    let db = DatabaseManager.getManager();
    exec.crawledSites = nodes.length;
    exec.endTime = new Date(Date.now());
    exec.executionStatus = 1;
    db.executionUpdate(exec).then((rows) => {
        if (rows < 1) {
            console.log(`error updating execution ${exec.id}`);
        }
    });

    db.storeNodeGraph(record, nodes).then(() => {
        console.log(`record ${record.id} graph stored`);
    }).catch((error) => {
        console.log(`record ${record.id} graph wasn't updated`, error);
    });
}

function rejectCrawling(errorMessage: string) {
    console.log(`crawler error ${errorMessage}`);
}