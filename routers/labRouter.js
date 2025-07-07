const express = require('express');
const labRouter = express.Router();
const labController = require('../controllers/labController');

labRouter.get('/', labController.renderLabPage);

// post for reservation logic

module.exports = labRouter;