const path = require('path');
const User = require('../model/userRegistry');

// `renderSigninPage` for GET requests
exports.renderSigninPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'auth_ref', 'sign_in.html'));
};

// `signinUser` for POST requests
exports.signinUser = async (req, res) => {
  try {
    const { DLSUemail, password } = req.body;
    const user = await User.findOne({ email: DLSUemail });

    if (!user) return res.send(`<script>alert("No account found."); window.history.back();</script>`); 
    if (user.password !== password) return res.send(`<script>alert("Incorrect Password."); window.history.back();</script>`);

    console.log(`Redirecting to /prof_info?baseId=${user._id}`);
    res.redirect(`/home?userId=${user._id}&baseId=${user._id}`);
  } catch (err) {
    console.error('Sign-in error:', err);
         return res.send(`
      <script>
        alert("Sign in failed.");
        window.history.back();
      </script>
    `);
  }
};