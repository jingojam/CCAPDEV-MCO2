const User = require('../model/userRegistry');

exports.renderHomePage = async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findById(userId).lean();

  res.render('home', {
    title: 'Home Page',
    userRole: 'STUDENT',
    isHome: true,
    user
  });
};
