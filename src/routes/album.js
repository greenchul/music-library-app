const express = require('express');
const {
  createAlbumController,
  readAlbumsController,
} = require('../controllers/album');

const albumRouter = express.Router();

albumRouter.post('/artist/:id/album', createAlbumController);

albumRouter.get('/albums', readAlbumsController);

module.exports = albumRouter;
