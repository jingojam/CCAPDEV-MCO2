const path = require('path');
const User = require('../model/userRegistry');

// `renderLoginPage` for GET requests
exports.renderLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth_ref', 'Login.html'));
};

// `loginUser` for POST requests
exports.loginUser = async (req, res) => {
  try {
    const { DLSUemail, password } = req.body;
    const user = await User.findOne({ email: DLSUemail });

    if (!user) return res.status(401).send('No account found.');
    if (user.password !== password) return res.status(401).send('Incorrect password.');

    console.log(`Redirecting to /prof_info?userId=${user._id}`);
    res.redirect(`/home?userId=${user._id}`);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed.');
  }
};