'use strict';

const { DatabaseManager } = require("../dbservice/databaseManager");


/**
 * Create new execution without values
 *
 * body Executions_body 
 * returns inline_response_201
 **/
exports.createExecution = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "success": true,
      "message": "message"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "success": true,
      "message": "message"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "success": true,
      "message": "message"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
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
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "success": true,
      "executionStatus": 1,
      "startTime": "startTime",
      "id": 0,
      "endTime": "endTime",
      "crawledSites": 5,
      "recId": 6
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get all executions
 *
 * returns inline_response_200_2
 **/
exports.getExecutions = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "executions": [{
        "executionStatus": 1,
        "startTime": "startTime",
        "id": 0,
        "endTime": "endTime",
        "crawledSites": 5,
        "recId": 6
      }, {
        "executionStatus": 1,
        "startTime": "startTime",
        "id": 0,
        "endTime": "endTime",
        "crawledSites": 5,
        "recId": 6
      }],
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
      "record":  record   };
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
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "success": true,
      "message": "message"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

