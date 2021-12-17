const express = require('express');
const { createAlbumController } = require('../controllers/album');

const albumRouter = express.Router();

albumRouter.post('/artist/:id/album', createAlbumController);

module.exports = albumRouter;
