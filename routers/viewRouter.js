const express = require('express');
const viewRouter = express.Router();
const viewController = require('../controllers/viewController');

viewRouter.get('/', viewController.renderViewPage);

module.exports = viewRouter;