const path = require('path');
const User = require('../model/userRegistry');
const ErrorList = require('../model/errorRegistry');
const bcrypt = require('bcrypt');

// GET: Render sign-up page
exports.renderSignupPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'auth_ref', 'sign_up.html'));
};

// POST: Handle user registration
exports.signupUser = async (req, res) => {
  try {
    const { fname, lname, DLSUemail, password } = req.body;

    const existing = await User.findOne({ email: DLSUemail });
    if (existing) {
      await ErrorList.create({
        error: `Attempted registration with existing email: ${DLSUemail}`,
        route: req.originalUrl,
        userEmail: DLSUemail
      });

      return res.send(`<script>alert("Email already registered."); window.history.back();</script>`);
    }

    const newUser = new User({
      first_name: fname,
      last_name: lname,
      email: DLSUemail,
      role: 'STUDENT',
      password
    });

    await newUser.save();
    res.redirect('/sign_in');
  } catch (err) {
    console.error('Sign-up error:', err);

    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      userEmail: req.body?.DLSUemail || 'unknown'
    });

    return res.send(`<script>alert("Sign-up failed."); window.history.back();</script>`);
  }
};
