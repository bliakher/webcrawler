'use strict';

var path = require('path');
var http = require('http');
var cors = require('cors');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');

var oas3Tools = require('oas3-tools');
const { schema } = require('./graphQL/graphql');
const { Executor } = require('./crawling/executor');
var serverPort = 8080;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var openApiApp = expressAppConfig.getApp();

//let executor = Executor.getExecutor();

var app = express()
app.use(/.*/, cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

let executor = Executor.getExecutor();

for (let i = 2; i < openApiApp._router.stack.length; i++) {
    app._router.stack.push(openApiApp._router.stack[i])
}


// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('My server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

