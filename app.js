const express = require('express');
const hbars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Handlebars setup + (EDITED) helpers
const exphbs = hbars.create({
  helpers: {
    ifEquals: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    },
    encodeURIComponent: function (value) {
      return encodeURIComponent(value);
    }
  },
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: 'main'
});

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data (needed for POST)
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// (DEPRECATED) Connect to MongoDB 
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));



// Import routers
const homeRoute = require('./routers/homeRouter.js');

const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');

const viewRoute = require('./routers/viewRouter.js');
const resEditRoute = require('./routers/res_editRouter.js');
const resInfoRoute = require('./routers/res_infoRouter.js');

const index = require('./routers/indexRouter.js');


// Home Reservation Page
app.use('/', homeRoute);

// Create Reservation Page
app.use('/create', createRoute);

// Laboratory Page
app.use('/laboratory', labRoute);

// View Reservation Page
app.use('/view', viewRoute);

// Edit Reservation Page
app.use('/res_edit', resEditRoute);

// Info Reservation Page
app.use('/res_info', resInfoRoute);


app.use('/index', index);


// Start the server
app.listen(port, () => {

  console.log(`App listening at http://localhost:${port}`);
});
