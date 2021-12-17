const express = require('express');
const {
  createArtistController,
  readArtistController,
  readSingleArtistController,
  updatingArtistController,
  deletingArtistController,
} = require('../controllers/artist');

const artistRouter = express.Router();

// artistRouter.post('/artist', createArtistController);
artistRouter
  .route('/artist')
  .get(readArtistController)
  .post(createArtistController);

// artistRouter.get('/artist/:id', readSingleArtistController);

// artistRouter.patch('/artist/:id', updatingArtistController);
// artistRouter.delete('/artist/:id', deletingArtistController);

artistRouter
  .route('/artist/:id')
  .get(readSingleArtistController)
  .patch(updatingArtistController)
  .delete(deletingArtistController);
module.exports = artistRouter;
