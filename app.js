const express = require('express');
const hbars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
//TODO: Fix prof_info
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
app.use('/auth_ref', express.static(path.join(__dirname, 'public', 'auth_ref')));

// MongoDB setup
const mongoURI = 'mongodb://localhost:27017/mco2DB';
const generateLabs = require('./controllers/seed');

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await generateLabs();
    

  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

const User = require('./model/userRegistry');

// Welcome Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth_ref', 'Welcome.html'));
});

// Routers
const homeRoute = require('./routers/homeRouter.js');
const signinRoute = require('./routers/sign_inRouter.js');
const signupRoute = require('./routers/sign_upRouter.js')
const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');
const viewRoute = require('./routers/viewRouter.js');
const resEditRoute = require('./routers/res_editRouter.js');
const resInfoRoute = require('./routers/res_infoRouter.js');
const profInfoRoute = require('./routers/prof_infoRouter.js'); // added
const profEditRoute = require('./routers/prof_editRouter.js');
const index = require('./routers/indexRouter.js');


// Mount routers
app.use('/sign_in', signinRoute);
app.use('/sign_up', signupRoute);
app.use('/home', homeRoute);
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