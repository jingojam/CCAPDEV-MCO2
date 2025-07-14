const User = require('../model/userRegistry'); // adjust path as needed
const Reservation = require('../model/reserveRegistry'); // adjust path

exports.renderInfoPage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses
    const reservations = await Reservation.find({ reservedBy: userId }).populate('reservedBy', 'first_name last_name').lean();

    res.render('prof_info', {
      title: 'View Profile Info',
      userRole: user.role,
      isProfileInfo: true,
      userId: userId,
      baseId: baseId,
      user,
      reservations
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading profile info');
  }
};