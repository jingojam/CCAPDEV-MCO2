const path = require('path');
const User = require('../model/userRegistry');
const ErrorList = require('../model/errorRegistry');
const bcrypt = require('bcrypt');

// GET: Render sign-in page
exports.renderSigninPage = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'auth_ref', 'sign_in.html'));
};

// POST: Handle sign-in logic
exports.signinUser = async (req, res) => {
  try {
    const { DLSUemail, password } = req.body;
    const user = await User.findOne({ email: DLSUemail });

    if (!user) {
      await ErrorList.create({
        error: `No account found for email: ${DLSUemail}`,
        route: req.originalUrl,
        userEmail: DLSUemail || 'unknown'
      });

      return res.send(`<script>alert("No account found."); window.history.back();</script>`); 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await ErrorList.create({
        error: `Incorrect password attempt for email: ${DLSUemail}`,
        route: req.originalUrl,
        userEmail: DLSUemail
      });

      return res.send(`<script>alert("Incorrect Password."); window.history.back();</script>`);
    }

    console.log(`Redirecting to /home?userId=${user._id}&baseId=${user._id}`);
    res.redirect(`/home?userId=${user._id}&baseId=${user._id}`);
  } catch (err) {
    console.error('Sign-in error:', err);

    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      userEmail: req.body?.DLSUemail || 'unknown'
    });

    return res.send(`
      <script>
        alert("Sign in failed.");
        window.history.back();
      </script>
    `);
  }
};
