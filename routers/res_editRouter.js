const express = require('express');
const resEditRouter = express.Router();
const resEditController = require('../controllers/res_editController');

resEditRouter.get('/:reservationId', resEditController.renderEditPage);
resEditRouter.post('/:reservationId', resEditController.submitEdit);
resEditRouter.post('/:reservationId/delete', resEditController.deleteReservation);

module.exports = resEditRouter;
