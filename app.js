const express = require('express');
const hbars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Handlebars setup
app.engine('handlebars', hbars.engine({

  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection string 
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB

// DEPRECATED
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));



// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Route: CSS

// import routers
const homeRoute = require('./routers/homeRouter.js');
const viewRoute = require('./routers/viewRouter.js');
const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');

// Home Reservation Page
app.use('/', homeRoute);

// Create Reservation Page
app.use('/create', createRoute);

// View Reservations Page
app.use('/view', viewRoute);

// Lab page
app.use('/laboratory', labRoute);


const index = require('./routers/indexRouter.js');
app.use('/index', index);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
