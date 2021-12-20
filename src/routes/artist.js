const express = require('express');
const {
  createArtistController,
  readArtistController,
  readSingleArtistController,
  updatingArtistController,
  deletingArtistController,
} = require('../controllers/artist');

const artistRouter = express.Router();

artistRouter
  .route('/artist')
  .get(readArtistController)
  .post(createArtistController);

artistRouter
  .route('/artist/:id')
  .get(readSingleArtistController)
  .patch(updatingArtistController)
  .delete(deletingArtistController);
module.exports = artistRouter;
