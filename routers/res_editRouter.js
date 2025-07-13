
const express = require('express');
const resEditRouter = express.Router();
const resEditController = require('../controllers/res_editController');

resEditRouter.get('/:reservationId', resEditController.renderEditPage);

module.exports = resEditRouter;
