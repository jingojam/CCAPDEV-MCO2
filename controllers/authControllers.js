const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findById(userId).lean();

  res.render('create', {
    title: 'Create Reservation',
    userRole: 'STUDENT',
    isCreate: true,
    user
  });
};