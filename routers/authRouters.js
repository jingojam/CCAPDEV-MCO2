const express = require('express');
const registerRouter = express.Router();
const loginRouter = express.Router();

const authControllers = require('../controllers/authControllers');

registerRouter.get('/', authControllers.registerPage);
loginRouter.get('/', authControllers.loginPage);

module.exports = registerRouter;
module.exports = loginRouter;