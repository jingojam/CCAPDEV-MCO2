const express = require('express');
const hbars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Handlebars setup + helpers
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

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth_ref', express.static(path.join(__dirname, 'views', 'auth_ref')));

// MongoDB setup
const mongoURI = 'mongodb://localhost:27017/mco2DB';
const generateLabs = require('./controllers/seed');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await generateLabs();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./model/userRegistry'); // user schema

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth_ref', 'Register.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { fname, lname, role, DLSUemail, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email: DLSUemail });
    if (existing) return res.status(400).send('Email already registered.');

    // Create and save new user
    const newUser = new User({
      first_name: fname,
      last_name: lname,
      email: DLSUemail,
      role,
      password_hash: password 
    });

    await newUser.save();
    res.send('User registered successfully.');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed.');
  }
});

// Login page rendered with Handlebars
app.get('/login', (req, res) => {
  res.render('auth_ref/Login');
});

// Routers
const homeRoute = require('./routers/homeRouter.js');
const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');
const viewRoute = require('./routers/viewRouter.js');
const resEditRoute = require('./routers/res_editRouter.js');
const resInfoRoute = require('./routers/res_infoRouter.js');
const profInfoRoute = require('./routers/prof_infoRouter.js');
const profEditRoute = require('./routers/prof_editRouter.js');
const index = require('./routers/indexRouter.js');

// Router mounting
app.use('/', homeRoute);
app.use('/create', createRoute);
app.use('/laboratory', labRoute);
app.use('/view', viewRoute);
app.use('/res_edit', resEditRoute);
app.use('/res_info', resInfoRoute);
app.use('/prof_info', profInfoRoute);
app.use('/prof_edit', profEditRoute);
app.use('/index', index);

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
