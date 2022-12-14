import { end } from 'cheerio/lib/api/traversing';
import { query } from 'express';
import { Pool } from 'pg';
import format from 'pg-format';
import { nodeModuleNameResolver } from 'typescript';
import { execution, nullexecution, startingExecution } from '../model/execution';
import { node } from '../model/node';
import { nullpage, webpage } from '../model/webpage';
import { parseResultToExecution, parseResultToNode, parseResultToWebpage } from './databaseUtils';

export class DatabaseManager {

	private static instance: DatabaseManager = null;

	private pool: Pool;

	private constructor() {
		let conStr = process.env.DATABASE_URL;
		this.pool = new Pool({ connectionString: conStr });
		this.pool.connect();
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



	private async getWebsitesTags(id: bigint): Promise<string[]> {
		return ((await this.runQuery(`SELECT value FROM tags WHERE webpage_id = ${id} `, [])).rows).map(val => val.value);
	}

	public async getWebsites(): Promise<webpage[]> {
		let result = (await this.runQuery('SELECT * FROM webpage ORDER BY id', [])).rows;
		let pages = [];
		for (let row of result) {
			row.tags = await this.getWebsitesTags(row.id);
			let lastExecution = (await this.runQuery(`SELECT executionstatus, starttime FROM execution WHERE webpage_id = $1 AND starttime= (SELECT MAX(e.starttime) from execution AS e WHERE e.webpage_id = $1)`, [row.id]));
			if (lastExecution.rowCount >= 1) {
				row.executionStatus = lastExecution.rows[0].executionstatus;
				row.executionTime = lastExecution.rows[0].starttime;
			}
			pages.push(parseResultToWebpage(row));
		}
		return pages;
	}

	public async getWebsite(id: bigint, endTime : boolean = false): Promise<webpage> {
		let timeColumn = "starttime";
		if (endTime) {
			timeColumn = "endtime";
		}

		let resutl = (await this.runQuery(`SELECT * FROM webpage WHERE id = $1`, [id])).rows;
		let webpage: webpage = Object.assign({}, nullpage);
		if (resutl.length == 0) {
			webpage.id = BigInt(0);
		} else {
			let res = resutl[0];
			res.tags = await this.getWebsitesTags(id);
			console.log(res);
			let lastExecution = await this.runQuery(`SELECT executionstatus, ${timeColumn} as time FROM execution WHERE webpage_id = $1 AND starttime= (SELECT MAX(e.starttime) from execution AS e WHERE e.webpage_id = $1)`, [res.id]);
			if (lastExecution.rowCount >= 1) {
				res.executionStatus = lastExecution.rows[0].executionstatus;
				res.executionTime = lastExecution.rows[0].time;
			}
			webpage = parseResultToWebpage(res);
		}
		return webpage;
	}

	public async getWebsitesWithLatestExecutionStop(): Promise<webpage[]> {
		let result = (await this.runQuery('SELECT * FROM webpage WHERE active = true ORDER BY id', [])).rows;
		let pages = [];
		for (let row of result) {
			row.tags = await this.getWebsitesTags(row.id);
			let lastExecution = (await this.runQuery(`SELECT endtime FROM execution WHERE webpage_id = $1 AND endtime = (SELECT MAX(e.endtime) from execution AS e WHERE e.webpage_id = $1)`, [row.id]));
			if (lastExecution.rowCount >= 1) {
				row.executionTime = lastExecution.rows[0].endtime;
			}
			pages.push(parseResultToWebpage(row));
		}
		return pages;
	}

	//creating website and its new tags
	public async createWebsite(site: webpage) : Promise<webpage> {
		const params = [site.url, site.regEx, site.periodicity, site.label, site.active];
		let result = await this.runQuery(`INSERT INTO webpage(url, regex, periodicity, label, active) VALUES($1, $2, $3, $4, $5) RETURNING id`, params);
		if (result.rows.length > 0) {
			const id = result.rows[0].id;
			console.log(`inserted record ${id}`);
			for (const tag of site.tags) {
				await this.createTag(id, tag);
			}
			site.id = id;
			return site;
		} else {
			return nullpage;
		}
	}

	private async createTag(id: bigint, tag: string) {
		const params = [id, tag];
		let result = await this.runQuery(`INSERT INTO tags(webpage_id, value) VALUES($1, $2)`, params);
		return result.rowCount;
	}

	//
	public async deleteWebsite(id: bigint) {
		const params = [id];
		let result = await this.runQuery('DELETE FROM webpage WHERE id = $1', params);
		return result.rowCount;
	}

	//
	public async updateWebsite(id: bigint, site: webpage) {
		const params = [id, site.url, site.regEx, site.periodicity, site.label, site.active];
		let result = (await this.runQuery(`UPDATE webpage SET url = $2, regex = $3, periodicity = $4, label = $5, active = $6 WHERE id = $1`, params))
		await this.runQuery('DELETE FROM tags WHERE webpage_id = $1', [id]);
		for (let tag of site.tags) {
			await this.createTag(id, tag);
		}
		return result.rowCount;
	}

	//
	public async getExecutions() {
		let result = (await this.runQuery('SELECT * FROM execution ORDER BY endtime DESC', [])).rows;
		let executions: execution[] = [];
		for (let exec of result) {
			executions.push(parseResultToExecution(exec));
		}
		return executions;
	}

	public async getExecution(id: bigint): Promise<execution> {
		const params = [id];
		let result = (await this.runQuery(`SELECT * FROM execution WHERE id = $1`, params)).rows;
		let execu: execution = Object.assign({}, nullexecution);
		if (result.length == 0) {
			execu.id = BigInt(0);
		} else {
			execu = parseResultToExecution(result[0]);
		}
		return execu;
	}

	//get graph from database for said webpage
	private async getNeighbours(nodeId: bigint) {
		const params = [nodeId];
		let result = (await this.runQuery(`SELECT node_id_to FROM nodelinks WHERE node_id_from = $1`, params)).rows;
		return result.map((e) => { return e.node_id_to; });
	}

	public async getCrawledSitesForGraph(recordID: bigint[]) {
		const params = [recordID];
		let result = (await this.runQuery(format(`SELECT * FROM nodes WHERE webpage_id IN (%L)`, recordID), [])).rows;
		let nodes = result.map((e) => { return parseResultToNode(e) });
		for (let node of nodes) {
			let neighbours = await this.getNeighbours(node.id);
			node.links = neighbours;
		}
		return nodes;
	}

	//log and save every executions
	//returns id of new execution, 0 if insert failed
	public async logNewExecution(execution: startingExecution): Promise<bigint> {
		const params = [execution.recId, execution.executionStatus, execution.startTime, execution.crawledSites];
		let result = await this.runQuery(`INSERT INTO execution(webpage_id, executionstatus, starttime, crawledsites) VALUES($1, $2, $3, $4) RETURNING id`, params);
		if (result.rowCount >= 1) {
			return result.rows[0].id;
		} else {
			return BigInt(0);
		}
	}

	//if rowCount <= 1 the execution doesn't exist
	public async executionUpdate(exec: execution) {
		console.log(`updating execution`, exec);
		const params = [exec.id, exec.executionStatus, exec.endTime, exec.crawledSites]
		let result = await this.runQuery(`UPDATE execution SET executionstatus = $2, endtime = $3, crawledsites = $4  WHERE id = $1`, params);
		return result.rowCount;
	}

	private prepareInsertLinksQuery(query: string, depth: number, maxDepth: number): string {
		if (depth === maxDepth) {
			return query;
		}
		return this.prepareInsertLinksQuery(`${query}, ($1, $${depth + 1})`, depth + 1, maxDepth);
	}

	private async insertNodeLinks(id: bigint, node: node, insertedItems: number, nodes: node[]): Promise<number> {
		if (node.links) {
			let values = node.links.map(id => { return [node.id, nodes[id].id] });
			console.log(`values`, values);
			if (values.length > 0) {
				let result = await this.runQuery(format('INSERT INTO nodelinks(node_id_from, node_id_to) VALUES %L', values), []);
				return insertedItems + result.rowCount;
			} else {
				return insertedItems;
			}

			/*let query = this.prepareInsertLinksQuery(`INSERT INTO nodelinks(node_id_from, node_id_to) VALUES($1, $2)`, 2, node.links.length + 1);
			let queryParams = [node.id].concat(node.links.map(id => { return nodes[id].id }));
			console.log(query, queryParams);
			let result = await this.runQuery(query, queryParams);*/
		} else {
			return 0;
		}
	}

	// links in node -> position of other node in array
	//return number of inserted items into database (nodes + all links)
	public async storeNodeGraph(record: webpage, nodes: node[]): Promise<number> {
		const deleteParams = [record.id];
		let result = await this.runQuery(`DELETE FROM nodes WHERE webpage_id = $1`, deleteParams);
		let insertedItems = 0;
		for (let node of nodes) {
			let params = [node.url, node.crawlTime, node.title, record.id];
			let result = await this.runQuery(`INSERT INTO nodes(url, crawl_time, title, webpage_id) VALUES($1, $2, $3, $4) RETURNING id`, params);
			if (result.rowCount >= 1) {
				node.id = result.rows[0].id;
				insertedItems += 1;
			} else {
				throw new Error('one node couldnt be saved');
			}
		}

		console.log(nodes);

		for (let node of nodes) {
			insertedItems = await this.insertNodeLinks(record.id, node, insertedItems, nodes);
		}

		return insertedItems;
	}

	public async removeUnfinishedExecutions() {
		let result = await this.runQuery(`DELETE FROM execution WHERE endtime IS NULL`, []);
		return result.rowCount;
	}
}