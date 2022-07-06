import { DatabaseManager } from "../dbservice/databaseManager";
import { webpage } from "../model/webpage";

class Executor {
    private static instance: Executor = null;

    private db : DatabaseManager;
    private records : webpage[];

    private constructor() {
        this.db = DatabaseManager.getManager();
        this.loadAndPlanAllExecutionsOnStart();
    }

    public static getExecutor(): Executor {
        if (!Executor.instance) {
            Executor.instance = new Executor();
        }
        return Executor.instance;
    }

    private async loadAndPlanAllExecutionsOnStart() {
        this.records = await this.db.getWebsites();
        for (let record of this.records) {
        }
    }

    private async startNewExecution() {

    }
}