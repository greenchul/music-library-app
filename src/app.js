const express = require('express');
const artistRouter = require('./routes/artist');
const albumRouter = require('../src/routes/album');

const app = express();

app.use(express.json());
app.use(artistRouter);
app.use(albumRouter);

app.get('/', (request, response) => {
  response.status(200).response.send('Hello World');
});

module.exports = app;
