
const express = require('express');
const resInfoRouter = express.Router();
const resInfoController = require('../controllers/res_infoController');

resInfoRouter.get('/:reservationId', resInfoController.renderInfoPage);

module.exports = resInfoRouter;
