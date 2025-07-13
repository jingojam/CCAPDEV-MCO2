const express = require('express');
const signupRouter = express.Router();
const signupController = require('../controllers/sign_upController');

signupRouter.get('/', signupController.renderSignupPage); // for GET requests to the signup page, use the `renderRegisterPage` from the controller
signupRouter.post('/', signupController.signupUser);// for POST requests to the signup page, use the `registerUser` from the controller

module.exports = signupRouter;
