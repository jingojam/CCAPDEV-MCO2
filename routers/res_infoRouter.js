

const express = require('express');
const resInfoRouter = express.Router();
const resInfoController = require('../controllers/res_infoController');

resInfoRouter.get('/', resInfoController.renderEditPage);

module.exports = resInfoRouter;
