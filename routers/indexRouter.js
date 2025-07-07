const express = require('express');
const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.render('index', {
    title: 'Index'
  });
});

module.exports = indexRouter;
