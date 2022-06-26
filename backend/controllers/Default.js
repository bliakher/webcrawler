'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

import { notFoundResponse, generalErrorResponse, iamTeaPotUCoffeeBrewer } from '../model/errorResponses';

module.exports.createExecution = function createExecution(req, res, next, body) {
  Default.createExecution(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createRecord = function createRecord(req, res, next, body) {
  Default.createRecord(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response == 418) {
        utils.writeJson(res, iamTeaPotUCoffeeBrewer);
      } else {
        utils.writeJson(res, generalErrorResponse);
      }
    });
};

module.exports.deleteRecord = function deleteRecord(req, res, next, recID) {
  Default.deleteRecord(recID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getExecution = function getExecution(req, res, next, execID) {
  Default.getExecution(execID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getExecutions = function getExecutions(req, res, next) {
  Default.getExecutions()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getRecord = function getRecord(req, res, next, recID) {
  Default.getRecord(recID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response === 404) {
        utils.writeJson(res, notFoundResponse);
      } else {
        utils.writeJson(res, generalErrorResponse);
      }
    });
};

module.exports.getRecords = function getRecords(req, res, next) {
  Default.getRecords()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, generalErrorResponse);
    });
};

module.exports.updateRecord = function updateRecord(req, res, next, body, recID) {
  Default.updateRecord(body, recID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
