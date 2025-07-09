
const express = require('express');
const profInfoRouter = express.Router();
const profInfoController = require('../controllers/prof_infoController');

profInfoRouter.get('/', profInfoController.renderEditPage);

module.exports = profInfoRouter;
