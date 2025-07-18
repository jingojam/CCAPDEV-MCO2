const User = require('../model/userRegistry'); 
const Reservation = require('../model/reserveRegistry');

exports.renderInfoPage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if (!userId || !baseId) {
      return res.send(`
        <script>
          alert("Missing UserID in query.");
          window.history.back();
        </script>
      `);
    }

    const user = await User.findById(userId).lean(); 

    // Get today's start (00:00:00)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      reservedBy: userId,
      lab_sched: { $gte: today }  // Only reservations for today and future
    }).populate('reservedBy', 'first_name last_name').lean();

    res.render('prof_info', {
      title: 'View Profile Info',
      userRole: user.role,
      isProfileInfo: true,
      userId,
      baseId,
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
