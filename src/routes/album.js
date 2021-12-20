const express = require('express');
const {
  createAlbumController,
  readAlbumsController,
  readSingleAlbumController,
  updateAlbumController,
  deleteAlbumController,
} = require('../controllers/album');

const albumRouter = express.Router();

albumRouter.post('/artist/:id/album', createAlbumController);

albumRouter.get('/album', readAlbumsController);

albumRouter
  .route('/album/:id')
  .get(readSingleAlbumController)
  .patch(updateAlbumController)
  .delete(deleteAlbumController);

module.exports = albumRouter;
