const express = require('express');
const searchRouter = express.Router();
const searchController = require('../controllers/searchController');

searchRouter.post('/search-user', searchController.searchFunction);
searchRouter.post('/find', searchController.find);

module.exports = searchRouter;