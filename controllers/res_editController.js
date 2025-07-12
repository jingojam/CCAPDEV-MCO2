const User = require('../model/userRegistry'); // adjust path

exports.renderEditPage = async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findById(userId); // or whatever your DB uses

  res.render('res_edit', {
    title: 'Edit Reservation',
    userRole: 'STUDENT',
    isResEdit: true,
    user
  });
};

