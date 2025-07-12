const express = require('express');
const router = express.Router();
const profInfoController = require('../controllers/prof_infoController');
const User = require('../model/userRegistry');

// GET /prof_info?userId=123

router.get('/', profInfoController.renderInfoPage);

module.exports = router;
