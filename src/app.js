const express = require('express');
const methodOverride = require('method-override');

const artistRouter = require('./routes/artist');
const albumRouter = require('../src/routes/album');

const app = express();

app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(artistRouter);
app.use(albumRouter);

app.get('/', (request, response) => {
  // response.status(200).sendFile('./views/index.html', { root: __dirname });
  response.status(200).render('index');
});

app.get('/create-artist', (req, res) => {
  res.status(200).render('create-artist');
});

module.exports = app;
