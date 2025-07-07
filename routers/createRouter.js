const express = require('express');
const createRouter = express.Router();
const createController = require('../controllers/createController');

createRouter.get('/', createController.renderCreatePage);

module.exports = createRouter;
