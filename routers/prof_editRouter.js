
const express = require('express');
const profEditRouter = express.Router();
const profEditController = require('../controllers/prof_editController');

profEditRouter.get('/', profEditController.renderEditPage);

module.exports = profEditRouter;
