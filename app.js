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
    },
    isReserved: function (reservations, seatLabel, selectedDate, startTime, endTime, options) {
      if (!reservations || !Array.isArray(reservations)) return false;

      const seatNum = parseInt(seatLabel.replace(/\D/g, ''), 10);

      const today = new Date(selectedDate);
      const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

      return reservations.some(res => {
        // Try both field names: 'seat' and 'seat_num'
        const resSeat = res.seat || res.seat_num;
        const sameSeat = parseInt(resSeat) === seatNum;

        // Compare dates
        const resDateString = new Date(res.lab_sched).toISOString().split('T')[0];

        // Compare times
        const sameTime = res.startTime === startTime && res.endTime === endTime;

        return sameSeat && resDateString === dateStr && sameTime;
      });
    },
    formatDate: function (date) {
      if (!date) return '';

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
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
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth_ref', express.static(path.join(__dirname, 'public', 'auth_ref')));

// MongoDB setup
const mongoURI = 'mongodb://localhost:27017/mco2DB';
const runSeeder = require('./controllers/seed.js'); // Import seeder

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✓  Connected to MongoDB');
        runSeeder(); // Run the seeder after successful connection
    })
    .catch(err => {
        console.error('X MongoDB connection error:', err);
    });

const User = require('./model/userRegistry');

// Welcome Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth_ref', 'Welcome.html'));
});

// Routers
const homeRoute = require('./routers/homeRouter.js');
const signinRoute = require('./routers/sign_inRouter.js');
const signupRoute = require('./routers/sign_upRouter.js');
const createRoute = require('./routers/createRouter.js');
const labRoute = require('./routers/labRouter.js');
const viewRoute = require('./routers/viewRouter.js');
const resEditRoute = require('./routers/res_editRouter.js');
const resInfoRoute = require('./routers/res_infoRouter.js');
const profInfoRoute = require('./routers/prof_infoRouter.js');
const profEditRoute = require('./routers/prof_editRouter.js');
const search = require('./routers/searchRouter.js');
const index = require('./routers/indexRouter.js');

// Route for serving user profile image
app.get('/user/:id/image', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.profileImage || !user.profileImage.data) {
            return res.send(`<script>alert("No profile image found"); window.history.back();</script>`);
        }

        res.contentType(user.profileImage.contentType);
        res.send(user.profileImage.data);
    } catch (err) {
        console.error(err);
         return res.send(`<script>alert("Error loading profile image.); window.history.back();</script>`);
    }
});

const reservationController = require('./controllers/reservationController');

// POST /api/reservations - Create a new reservation
app.post('/api/reservations', reservationController.createReservation);

// Mount routers
app.use('/sign_in', signinRoute);
app.use('/sign_up', signupRoute);
app.use('/home', homeRoute);
app.use('/create', createRoute);
app.use('/laboratory', labRoute);
app.use('/view', viewRoute);
app.use('/res_edit', resEditRoute);
app.use('/res_info', resInfoRoute);
app.use('/prof_info', profInfoRoute);
app.use('/prof_edit', profEditRoute);
app.use('/', search);
app.use('/index', index);

// Start server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});