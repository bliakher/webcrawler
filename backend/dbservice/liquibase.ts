import { Client } from 'pg';

export class DatabaseManager {

	private client : Client; 

	constructor() {
		let conStr = process.env.DATABASE_URL;
		console.log(conStr);
		this.client = new Client({connectionString : conStr});
		this.client.connect();
		this.getTestData();
	}

	private async getTestData() {
		this.client.query('SELECT * FROM test_table', (err, res) => {
			if (err) {
			  console.log(err.stack)
			} else {
			  console.log(res.rows)
			}
			this.client.end();
		  });	
	}
}