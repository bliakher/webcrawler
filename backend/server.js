const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Web Crawler<br>' + Date(Date.now()).toString());
});

const PORT = 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
