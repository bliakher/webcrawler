'use strict';

const { Executor } = require('../crawling/executor');
const { DatabaseManager } = require('../dbservice/databaseManager.ts');
const { validateRecord } = require('../model/validators');

/**
 * Create new execution without values
 *
 * body Executions_body 
 * returns inline_response_201
 **/
exports.createExecution = function (body) {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let db = DatabaseManager.getManager();
		let record = await db.getWebsite(body.recordId);
		examples['application/json'] = {
			"success": true,
			"message": "successfully created"
		};
		if (record.id == 0) {
			reject(404);
		} else {
			let executor = Executor.getExecutor();
			executor.startImmidiateExecution(record);
			resolve(examples[Object.keys(examples)[0]]);
		}
	});
}


/**
 * Create new record without values
 *
 * body Records_body 
 * returns inline_response_201
 **/
exports.createRecord = function (body) {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let page = Object.assign({}, body);
		if (!validateRecord(page)) {
			reject(400);
		} else {
			let db = DatabaseManager.getManager();
			let insertedSite = await db.createWebsite(page);
			examples['application/json'] = {
				"success": true,
				"id" : insertedSite.id,
				"message": "successfully created"
			};
			if (insertedSite.id > 0) {
				if (page.active) {
					let executor = Executor.getExecutor();
					executor.startImmidiateExecution(insertedSite, false);
					console.log('creating new page record');
				} else {
					console.log(`new page is inactive`);
				}
				resolve(examples[Object.keys(examples)[0]]);
			} else {
				reject(418);
			}
		}
	});
}


/**
 * Delete record with id
 *
 * recID Long 
 * returns inline_response_201
 **/
exports.deleteRecord = function (recID) {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let db = DatabaseManager.getManager();
		let deletedRows = await db.deleteWebsite(recID);
		examples['application/json'] = {
			"success": true,
			"message": "successfully deleted"
		};
		if (deletedRows >= 1) {
			let executor = Executor.getExecutor();
			executor.stopExecutions(recID);
			resolve(examples[Object.keys(examples)[0]]);
		} else {
			reject(404);
		}
	});
}


/**
 * Get execution by id
 *
 * execID Long 
 * returns inline_response_200_3
 **/
exports.getExecution = function (execID) {
	return new Promise(async function (resolve, reject) {
		let db = DatabaseManager.getManager();
		const exec = await db.getExecution(execID);
		var examples = {};
		examples['application/json'] = {
			"success": true,
			"execution": exec
		};
		if (exec.id > 0) {
			resolve(examples[Object.keys(examples)[0]]);
		} else {
			reject(404);
		}
	});
}


/**
 * Get all executions
 *
 * returns inline_response_200_2
 **/
exports.getExecutions = function () {
	return new Promise(async function (resolve, reject) {
		let db = DatabaseManager.getManager();
		const exec = await db.getExecutions();

		var examples = {};
		examples['application/json'] = {
			"executions": exec,
			"success": true
		};
		if (Object.keys(examples).length > 0) {
			resolve(examples[Object.keys(examples)[0]]);
		} else {
			resolve();
		}
	});
}


/**
 * Get record by id
 *
 * recID Long 
 * returns inline_response_200_1
 **/
exports.getRecord = function (recID) {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let db = DatabaseManager.getManager();
		const record = await db.getWebsite(recID);
		console.log(record);
		examples['application/json'] = {
			"success": true,
			"record": record
		};
		if (record.id != 0) {
			resolve(examples[Object.keys(examples)[0]]);
		} else {
			reject(404);
		}
	});
}


/**
 * Get all records
 *
 * returns inline_response_200
 **/
exports.getRecords = function () {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let dbManager = DatabaseManager.getManager();
		examples['application/json'] = {
			"records": await dbManager.getWebsites(),
			"success": true
		};
		if (Object.keys(examples).length > 0) {
			resolve(examples[Object.keys(examples)[0]]);
		} else {
			resolve();
		}
	});
}


/**
 * Update record with id
 *
 * body Records_recID_body 
 * recID Long 
 * returns inline_response_201
 **/
exports.updateRecord = function (body, recID) {
	return new Promise(async function (resolve, reject) {
		var examples = {};
		let dbManager = DatabaseManager.getManager();
		if (!validateRecord(body)) {
			reject(400);
		} else {
			let rows = await dbManager.updateWebsite(recID, body);
			examples['application/json'] = {
				"success": true,
				"message": "messageUpdate"
			};
			if (rows == 1) {
				let executor = Executor.getExecutor();
				executor.updateRecord(recID);
				resolve(examples[Object.keys(examples)[0]]);
			} else if (rows == 0) {
				reject(404);
			} else if (rows < 0) {
				reject(500);
			} else {
				reject(418);
			}
		}
	});
}

