const express = require('express');
const loginRouter = express.Router();
const loginController= require('../controllers/loginController');

loginRouter.get('/', loginController.renderLoginPage); // GET requests
loginRouter.post('/', loginController.loginUser);  //POST requests

module.exports = loginRouter;
