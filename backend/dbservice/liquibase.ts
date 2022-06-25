import { Pool } from 'pg';

export class DatabaseManager {

	private static instance : DatabaseManager = null;

	private pool : Pool; 

	private constructor() {
		let conStr = process.env.DATABASE_URL;
		console.log(conStr);
		this.pool = new Pool({connectionString : conStr});
		this.pool.connect();

		this.getTestData();
	}

	public static getManager() : DatabaseManager {
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

}