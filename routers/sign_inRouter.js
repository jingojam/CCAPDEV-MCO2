const express = require('express');
const signinRouter = express.Router();
const signinController = require('../controllers/sign_inController');

signinRouter.get('/', signinController.renderSigninPage); // GET requests
signinRouter.post('/', signinController.signinUser);  //POST requests

module.exports = signinRouter;
