const express = require('express');
const {
  createArtistController,
  readArtistController,
  readSingleArtistController,
} = require('../controllers/artist');

const artistRouter = express.Router();

// artistRouter.post('/artist', createArtistController);
artistRouter
  .route('/artist')
  .get(readArtistController)
  .post(createArtistController);

artistRouter.get('/artist/:id', readSingleArtistController);
module.exports = artistRouter;
