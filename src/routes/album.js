const express = require('express');
const {
  createAlbumController,
  readAlbumsController,
  readSingleAlbumController,
} = require('../controllers/album');

const albumRouter = express.Router();

albumRouter.post('/artist/:id/album', createAlbumController);

albumRouter.get('/album', readAlbumsController);

albumRouter.get('/album/:id', readSingleAlbumController);

module.exports = albumRouter;
