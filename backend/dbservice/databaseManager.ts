import { Pool } from 'pg';
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

	private async getWebsitesTags(id: bigint): Promise<string[]> {
		return ((await this.runQuery(`SELECT value FROM tags WHERE webpage_id = ${id} `, [])).rows).map(val => val.value);
	}

	public async getWebsites(): Promise<webpage[]> {
		let result = (await this.runQuery('SELECT * FROM webpage', [])).rows;
		for (let row of result) {
			row.tags = await this.getWebsitesTags(row.id);
		}
		return result;
	}

	public async getWebsite(id: bigint): Promise<webpage> {
		let resutl = (await this.runQuery(`SELECT * FROM webpage WHERE id = $1`, [id])).rows;
		let webpage: webpage = Object.assign({}, nullpage);
		if (resutl.length == 0) {
			webpage.id = BigInt(0);
		} else {
			webpage = resutl[0];
			webpage.tags = await this.getWebsitesTags(id);
		}
		return webpage;
	}

	public async createWebsite(site: webpage) {
		const params = [site.url, site.regEx, site.periodicity, site.label, site.active];
		let result = await this.runQuery(`INSERT INTO webpage(url, regEx, periodicity, label, active) VALUES($1, $2, $3, $4, $5) RETURNING id`, params);
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
		let result = (await this.runQuery(`UPDATE webpage SET url = $2, regEx = $3, periodicity = $4, label = $5, active = $6 WHERE id = $1`, params))
		await this.runQuery('DELETE FROM tags WHERE webpage_id = $1', [id]);
		for (let tag of site.tags) {
			await this.createTag(id, tag);
		}
		return result.rowCount;
	}
}