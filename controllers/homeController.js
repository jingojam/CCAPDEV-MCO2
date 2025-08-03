const User = require('../model/userRegistry');
const ErrorList = require('../model/errorRegistry');

exports.renderHomePage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    const errorMessage = "Id is not found.";

    if (!baseId || !(/^[0-9a-fA-F]{24}$/.test(baseId))) {
      throw new Error(errorMessage);
    }
    if (!userId || !(/^[0-9a-fA-F]{24}$/.test(userId))) {
      throw new Error(errorMessage);
    }

    const user = await User.findById(baseId).lean();
    const viewUser = await User.findById(userId).lean();

    if (!user || !viewUser) {
      throw new Error(errorMessage);
    }

    res.render('home', {
      title: 'Home Page',
      userRole: user.role,
      isHome: true,
      userId,
      baseId
    });

  } catch (err) {
    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      user: req.query.baseId
    });

    return res.send(`
      <script>
        alert("${err.message}"); window.history.back();
      </script>
    `);
  }
};
