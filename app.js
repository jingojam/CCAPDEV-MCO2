const express = require('express');
const hbars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Handlebars setup
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

// Middleware
app.use(express.urlencoded({ extended: true }));
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

const User = require('./model/userRegistry');

// Routes for static forms
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth_ref', 'Register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth_ref', 'Login.html'));
});

// POST: Register
app.post('/register', async (req, res) => {
  try {
    const { fname, lname, role, DLSUemail, password } = req.body;

    const existing = await User.findOne({ email: DLSUemail });
    if (existing) return res.status(400).send('Email already registered.');

    const newUser = new User({
      first_name: fname,
      last_name: lname,
      email: DLSUemail,
      role,
      password
    });

    await newUser.save();
      res.redirect('/auth_ref/Login.html');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed.');
  }
});

// POST: Login
app.post('/Login', async (req, res) => {
  try {
    const { DLSUemail, password } = req.body;
    const user = await User.findOne({ email: DLSUemail });

    if (!user) return res.status(401).send('No account found.');
    if (user.password !== password) return res.status(401).send('Incorrect password.');

    console.log(`Redirecting to /prof_info?userId=${user._id}`);
    res.redirect(`/prof_info?userId=${user._id}`);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed.');
  }
});

// Routers
const homeRoute = require('./routers/homeRouter.js');
const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');
const viewRoute = require('./routers/viewRouter.js');
const resEditRoute = require('./routers/res_editRouter.js');
const resInfoRoute = require('./routers/res_infoRouter.js');
const profInfoRoute = require('./routers/prof_infoRouter.js'); // added
const profEditRoute = require('./routers/prof_editRouter.js');
const index = require('./routers/indexRouter.js');

// Mount routers
app.use('/', homeRoute);
app.use('/create', createRoute);
app.use('/laboratory', labRoute);
app.use('/view', viewRoute);
app.use('/res_edit', resEditRoute);
app.use('/res_info', resInfoRoute);
app.use('/prof_info', profInfoRoute); //added
app.use('/prof_edit', profEditRoute);
app.use('/index', index);

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
