import { Pool } from 'pg';
import { ModuleResolutionKind } from 'typescript';
import { execution, nullexecution, startingExecution } from '../model/execution';
import { nullpage, webpage } from '../model/webpage';
import { writeJson } from '../utils/writer';

export class DatabaseManager {

	private static instance: DatabaseManager = null;

	private pool: Pool;

	private constructor() {
		let conStr = process.env.DATABASE_URL;
		this.pool = new Pool({ connectionString: conStr });
		this.pool.connect();

		//this.getTestData();
	}

	private async runQuery(query: string, params: any) {
		return this.pool.query(query, params);
	}

	public static getManager(): DatabaseManager {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new DatabaseManager();
		}
		return DatabaseManager.instance;
	}


	private async getTestData() {
		this.pool.query('SELECT * FROM test_table', (err, res) => {
			if (err) {
				console.log(err.stack)
			} else {
				console.log(res.rows)
			}
		});
	}

	private parseResultToWebpage(result: any): webpage {
		return {
			id: result.id,
			regEx: result.regex,
			label: result.label,
			periodicity: result.periodicity,
			tags: result.tags,
			active: result.active,
			url: result.url,
		}
	}

	private parseResultToExecution(result: any): execution {
		return {
			id: result.id,
			recId: result.webpage_id,
			executionStatus: result.executionstatus,
			startTime: result.starttime,
			endTime: result.endtime,
			crawledSites: result.crawledsites,
		}
	}

	private async getWebsitesTags(id: bigint): Promise<string[]> {
		return ((await this.runQuery(`SELECT value FROM tags WHERE webpage_id = ${id} `, [])).rows).map(val => val.value);
	}

	public async getWebsites(): Promise<webpage[]> {
		let result = (await this.runQuery('SELECT * FROM webpage', [])).rows;
		let pages = [];
		for (let row of result) {
			row.tags = await this.getWebsitesTags(row.id);
			pages.push(this.parseResultToWebpage(row));
		}
		return pages;
	}

	public async getWebsite(id: bigint): Promise<webpage> {
		let resutl = (await this.runQuery(`SELECT * FROM webpage WHERE id = $1`, [id])).rows;
		let webpage: webpage = Object.assign({}, nullpage);
		if (resutl.length == 0) {
			webpage.id = BigInt(0);
		} else {
			webpage = resutl[0];
			webpage.tags = await this.getWebsitesTags(id);
			webpage = this.parseResultToWebpage(webpage);
		}
		return webpage;
	}

	public async createWebsite(site: webpage) {
		const params = [site.url, site.regEx, site.periodicity, site.label, site.active];
		let result = await this.runQuery(`INSERT INTO webpage(url, regex, periodicity, label, active) VALUES($1, $2, $3, $4, $5) RETURNING id`, params);
		let count = result.rowCount;
		if (count >= 1) {
			const id = result.rows[0].id;
			for (const tag of site.tags) {
				count += await this.createTag(id, tag);
			}
		}
		return count;
	}

	private async createTag(id: bigint, tag: string) {
		const params = [id, tag];
		let result = await this.runQuery(`INSERT INTO tags(webpage_id, value) VALUES($1, $2)`, params);
		return result.rowCount;
	}

	public async deleteWebsite(id: bigint) {
		const params = [id];
		let result = await this.runQuery('DELETE FROM webpage WHERE id = $1', params);
		return result.rowCount;
	}

	public async updateWebsite(id: bigint, site: webpage) {
		const params = [id, site.url, site.regEx, site.periodicity, site.label, site.active];
		let result = (await this.runQuery(`UPDATE webpage SET url = $2, regex = $3, periodicity = $4, label = $5, active = $6 WHERE id = $1`, params))
		await this.runQuery('DELETE FROM tags WHERE webpage_id = $1', [id]);
		for (let tag of site.tags) {
			await this.createTag(id, tag);
		}
		return result.rowCount;
	}

	public async getExecutions() {
		let result = (await this.runQuery('SELECT * FROM execution', [])).rows;
		let executions: execution[] = [];
		for (let exec of result) {
			executions.push(this.parseResultToExecution(exec));
		}
		return executions;
	}

	public async getExecution(id: bigint): Promise<execution> {
		const params = [id];
		let result = (await this.runQuery(`SELECT * FROM execution WHERE id = $1`, params)).rows;
		console.log(result);
		let execu: execution = Object.assign({}, nullexecution);
		if (result.length == 0) {
			execu.id = BigInt(0);
		} else {
			execu = this.parseResultToExecution(result[0]);
		}
		return execu;
	}

	//returns id of new execution, 0 if insert failed
	public async logNewExecution(execution: startingExecution): Promise<bigint> {
		const params = [execution.recId, execution.executionStatus, execution.startTime, execution.crawledSites];
		let result = await this.runQuery(`INSERT INTO execution(webpage_id, executionstatus, starttime, crawledsites) VALUES($1, $2, $3, $4) RETURNING id`, params);
		let count = result.rowCount;
		if (result.rowCount >= 1) {
			return result.rows[0].id;
		} else {
			return BigInt(0);
		}
	}

	//if rowCount <= 1 the execution doesn't exist
	public async executionUpdate(exec : execution) {
		const params = [exec.id, exec.executionStatus, exec.endTime, exec.crawledSites]
		let result = await this.runQuery(`UPDATE execution SET executionstatus = $2, endtime = $3, crawledsites = $4  WHERE id = $1`, params);
		return result.rowCount;
		//TODO update pages
	}
}