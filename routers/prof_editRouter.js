
const express = require('express');
const profEditRouter = express.Router();
const profEditController = require('../controllers/prof_editController');

profEditRouter.get('/', profEditController.renderEditPage);
profEditRouter.post('/delete-profile', profEditController.deleteProfile);
profEditRouter.post('/save-edit', profEditController.saveEdit);

module.exports = profEditRouter;
