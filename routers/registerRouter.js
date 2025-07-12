const express = require('express');
const registerRouter = express.Router();
const registerController= require('../controllers/registerController');

registerRouter.get('/', registerController.renderRegisterPage); // for GET requests to the register page, use the `renderRegisterPage` from the controller
registerRouter.post('/', registerController.registerUser);// for POST requests to the register page, use the `registerUser` from the controller

module.exports = registerRouter;
