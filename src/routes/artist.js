const express = require('express');
const controller = require('../controllers/artist');

const router = express.Router();

router.post('/', controller);

module.exports = router;
