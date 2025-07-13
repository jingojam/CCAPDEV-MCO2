const express = require('express');
const labRouter = express.Router();

const labController = require('../controllers/labController');

labRouter.get('/:id', labController.renderLabPage);
labRouter.post('/:id', labController.reserveLab);

// post for reservation logic

module.exports = labRouter;