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
    const baseUser = await User.findById(baseId).lean();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      reservedBy: userId,
      lab_sched: { $gte: today }
    }).populate('reservedBy', 'first_name last_name').lean();

    res.render('prof_info', {
      title: 'View Profile Info',
      userRole: baseUser.role,  
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
