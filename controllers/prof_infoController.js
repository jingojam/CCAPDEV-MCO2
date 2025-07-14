const User = require('../model/userRegistry'); // adjust path as needed
const Reservation = require('../model/reserveRegistry'); // adjust path

exports.renderInfoPage = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.send(`
      <script>
        alert("Missing UserID in query.");
        window.history.back();
      </script>
    `);
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses
    const reservations = await Reservation.find({ reservedBy: userId }).populate('reservedBy', 'first_name last_name').lean();

    res.render('prof_info', {
      title: 'View Profile Info',
      userRole: user.role,
      isProfileInfo: true,
      user,
      reservations
    });
  } catch (err) {
    console.error(err);
    return res.send(`
      <script>
        alert("Error loading profile ID.");
        window.history.back();
      </script>
    `);
  }
};