import { Pool, spawn, Worker } from "threads";
import { DatabaseManager } from "../dbservice/databaseManager";
import { execution, startingExecution } from "../model/execution";
import { node } from "../model/node";
import { webpage } from "../model/webpage";
import { scheduleJob } from "node-schedule";
import { crawlerData } from "../model/crawlerData";

export class Executor {
    private static instance: Executor = null;

    private db: DatabaseManager;
    private records: webpage[];

    private pool: Pool<any>;

    private constructor() {
        this.pool = Pool(() => spawn(new Worker('./crawler')));
        this.db = DatabaseManager.getManager();
        console.log("loading");
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
            if (!record.lastExecTime || record.lastExecTime === "") {
                this.startImmidiateExecution(record, true);
            } else {

                let nextStart = new Date(Date.parse(record.lastExecTime) + (record.periodicity * 60 * 1000));
                console.log(nextStart);
                if (nextStart.getTime() <= Date.now()) {
                    this.startImmidiateExecution(record, false);
                } else {
                    this.planExecution(record, nextStart);
                }
            }
        }
    }

    private async startImmidiateExecution(record: webpage, fromPost: boolean = true) {
        console.log(`running execution for record ${record.id}`);
        let exec: execution = await this.logNewExecution(record);
        const task = this.pool.queue(async crawler => crawler(record, exec));
        task.then((result: crawlerData) => {
            this.resolveCrawledGraph(result.nodes, result.record, result.exec);

            if (!fromPost) {
                this.planExecution(record, new Date(Date.now() + (record.periodicity * 60 * 1000)));
            }
        }).catch((error) => {
            console.log(error);
            //TODO log error execution and fail
        });
    }

    private async planExecution(record: webpage, expectedStart: Date) {
        scheduleJob(expectedStart, function () {
            let e = Executor.getExecutor();
            e.startImmidiateExecution(record, false);
        });
        console.log(`execution for record ${record.id} planned`, expectedStart);
    }

    private async logNewExecution(record: webpage): Promise<execution> {
        let exec: startingExecution = {
            recId: record.id,
            crawledSites: 0,
            executionStatus: 1,
            startTime: new Date(Date.now())
        };
        let execId = await this.db.logNewExecution(exec);
        return await this.db.getExecution(execId);
    }

    private resolveCrawledGraph(nodes: node[], record: webpage, exec: execution) {
        let db = DatabaseManager.getManager();
        console.log(nodes);
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
}