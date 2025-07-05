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
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));



// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));



// Route: CSS

// Home Reservation Page
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    userRole: 'STUDENT',
    isHome: true
  });
});

// Create Reservation Page
app.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create Reservation',
    userRole: 'STUDENT',
    isCreate: true
  });
});

// View Reservations Page
app.get('/view', (req, res) => {
  res.render('view', {
    title: 'View Reservations',
    userRole: 'STUDENT',
    isView: true
  });
});







app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
