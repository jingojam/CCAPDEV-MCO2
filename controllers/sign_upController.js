const path = require('path');
const User = require('../model/userRegistry');

// `renderSignupPage` is for rendering the page layout
exports.renderSignupPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'auth_ref', 'sign_up.html'));
};

// `signupUser` is for actual post logic for registrrations
exports.signupUser = async (req, res) => {
  try {
    const { fname, lname, role, DLSUemail, password } = req.body;

    const existing = await User.findOne({ email: DLSUemail });
    if (existing) return res.send(` <script> alert("Email already registered.");window.history.back();</script>`);

    const newUser = new User({
      first_name: fname,
      last_name: lname,
      email: DLSUemail,
      role,
      password
    });

    await newUser.save();
    res.redirect('/sign_in');
  } catch (err) {
    console.error('Sign-up error:', err);
    return res.send(` <script> alert("Sign-up failed.");window.history.back();</script>`);
  }
};