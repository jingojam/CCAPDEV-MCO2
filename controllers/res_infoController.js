const User = require('../model/userRegistry');
const Reservation = require('../model/reserveRegistry');

exports.renderInfoPage = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).send('No userId parameter set');
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).send('No user found');
    }

    const reservation = await Reservation.findById(reservationId).lean();
    if (!reservation) {
      return res.status(404).send('Reservation not found');
    }

    // Format values for the template
    const selectedDate = new Date(reservation.lab_sched).toISOString().split('T')[0]; // yyyy-mm-dd
    const selectedTime = formatTimeRange(reservation.startTime, reservation.endTime);
    const selectedLab = reservation.lab_name;
    const selectedSeat = reservation.seat;
    const requestTime = new Date(reservation.requestDate).toISOString(); // Full UTC timestamp

    res.render('res_info', {
      title: 'Info - Reservation',
      userRole: user.role,
      isResInfo: true,
      user,
      selectedDate,
      selectedTime,
      selectedLab,
      selectedSeat,
      requestTime
    });
  } catch (err) {
    console.error(err);
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
