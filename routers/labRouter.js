const express = require('express');
const labRouter = express.Router();

const labController = require('../controllers/labController');

labRouter.get('/:id', labController.renderLabPage);

module.exports = labRouter;