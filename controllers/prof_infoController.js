const User = require('../model/userRegistry'); // adjust path as needed
const Reservation = require('../model/labRegistry'); // adjust path

exports.renderInfoPage = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).send('Missing userId in query');
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses
    const reservations = await Reservation.find({ user: userId });

    res.render('prof_info', {
      title: 'View Profile Info',
      userRole: 'STUDENT',
      isProfileInfo: true,
      user,
      reservations
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading profile info');
  }
};