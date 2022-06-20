const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Web Crawler');
});

const PORT = 8080;
const HOST = 'localhost';
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
