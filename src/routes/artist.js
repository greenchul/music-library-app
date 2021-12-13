const express = require('express');
const {
  createArtistController,
  readArtistController,
} = require('../controllers/artist');

const artistRouter = express.Router();

// artistRouter.post('/artist', createArtistController);
artistRouter
  .route('/artist')
  .get(readArtistController)
  .post(createArtistController);

module.exports = artistRouter;
