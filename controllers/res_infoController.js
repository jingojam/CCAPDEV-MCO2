const User = require('../model/userRegistry');
const Resv = require('../model/reserveRegistry');
const ErrorList = require('../model/errorRegistry'); 

exports.renderInfoPage = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if (!userId || !baseId) {
      await ErrorList.create({
        error: 'Missing userId or baseId in query.',
        route: req.originalUrl,
        userEmail: 'unknown'
      });

      return res.send(`
        <script>
          alert("No userId parameter set.");
          window.history.back();
        </script>
      `);
    }

    const user = await User.findById(baseId).lean();
    if (!user) {
      await ErrorList.create({
        error: `Base user with ID ${baseId} not found.`,
        route: req.originalUrl,
        userEmail: 'unknown'
      });

      return res.send(`
        <script>
          alert("No user found.");
          window.history.back();
        </script>
      `);
    }

    const resv = await Resv.findById(reservationId).lean();
    if (!resv) {
      await ErrorList.create({
        error: `Reservation with ID ${reservationId} not found.`,
        route: req.originalUrl,
        userEmail: user.email || 'unknown'
      });

      return res.status(404).send('Reservation not found');
    }

    // Format values for the template
    const selectedDate = new Date(resv.lab_sched).toISOString().split('T')[0]; // yyyy-mm-dd
    const selectedTime = formatTimeRange(resv.startTime, resv.endTime);
    const selectedLab = resv.lab_name;
    const selectedSeat = resv.seat;
    const requestTime = new Date(resv.requestDate).toISOString(); // Full UTC timestamp

    res.render('res_info', {
      title: 'Info - Reservation',
      userRole: user.role,
      isResInfo: true,
      userId,
      baseId,
      user,
      selectedDate,
      selectedTime,
      selectedLab,
      selectedSeat,
      requestTime
    });
  } catch (err) {
    console.error(err);

    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      userEmail: req.query.userId || 'unknown'
    });

    res.status(500).send('Server Error');
  }
};

// Helper to format "0900" - "1000" → "09:00 - 10:00"
function formatTimeRange(start, end) {
  return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
}

function formatSingleTime(timeStr) {
  const h = parseInt(timeStr.slice(0, 2), 10);
  const m = timeStr.slice(2);
  return `${h.toString().padStart(2, '0')}:${m}`;
}
