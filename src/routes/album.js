const express = require('express');
const {
  createAlbumController,
  readAlbumsController,
} = require('../controllers/album');

const albumRouter = express.Router();

albumRouter.post('/artist/:id/album', createAlbumController);

albumRouter.get('/album', readAlbumsController);

module.exports = albumRouter;
