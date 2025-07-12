const path = require('path');
const User = require('../model/userRegistry');

// `renderUserPage` is for rendering the page layout
exports.renderRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth_ref', 'Register.html'));
};

// `registerUser` is for actual post logic for registrrations
exports.registerUser = async (req, res) => {
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
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed.');
  }
};