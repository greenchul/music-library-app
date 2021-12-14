const express = require('express');
const {
  createArtistController,
  readArtistController,
  readSingleArtistController,
  updatingArtistController,
} = require('../controllers/artist');

const artistRouter = express.Router();

// artistRouter.post('/artist', createArtistController);
artistRouter
  .route('/artist')
  .get(readArtistController)
  .post(createArtistController);

artistRouter.get('/artist/:id', readSingleArtistController);

artistRouter.patch('/artist/:id', updatingArtistController);
module.exports = artistRouter;
