const User = require('../model/userRegistry'); 
const Reservation = require('../model/reserveRegistry');
const ErrorList = require('../model/errorRegistry');

exports.renderInfoPage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;
    const errorMessage = "Missing or invalid ID.";

    if (!userId || !(/^[0-9a-fA-F]{24}$/.test(userId)) || !baseId || !(/^[0-9a-fA-F]{24}$/.test(baseId))) {
      throw new Error(errorMessage);
    }

    const user = await User.findById(userId).lean();
    const baseUser = await User.findById(baseId).lean();

    if (!user || !baseUser) {
      throw new Error(errorMessage);
    }

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
    await ErrorList.create({
      error: "Error loading profile ID.",
      stack: err.stack,
      route: req.originalUrl,
      user: req.query.baseId
    });
    return res.send(`
      <script>
        alert("Error loading profile ID.");
        window.history.back();
      </script>
    `);
  }
};
