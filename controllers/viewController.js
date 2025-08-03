const User = require('../model/userRegistry');
const Reservation = require('../model/reserveRegistry');

exports.renderViewPage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if (!userId || !baseId) {
      return res.status(400).send('Ids not found');
    }

    const user = await User.findById(baseId).lean();
    const now = new Date();

    
    const reservations = await Reservation
      .find({ reservedBy: baseId })
      .sort({ lab_sched: 1, startTime: 1 })
      .lean();

    const currentReservations = [];
    const completedReservations = [];

    reservations.forEach((res) => {
      const reservationDate = new Date(res.lab_sched);
      const reservationEndTime = parseTime(res.endTime);

      const combinedEnd = new Date(reservationDate);
      combinedEnd.setUTCHours(reservationEndTime.hours);
      combinedEnd.setUTCMinutes(reservationEndTime.minutes);

      const commonDetails = {
        date: reservationDate.toISOString().split('T')[0],
        time: formatTimeRange(res.startTime, res.endTime),
        laboratory: res.lab_name,
        seat: `Seat ${res.seat}`,
        requestDate: new Date(res.requestDate).toISOString()
      };

      if (combinedEnd > now) {
        currentReservations.push({
          ...commonDetails,
          link: `/res_edit/${res._id}?userId=${userId}&baseId=${user._id}`
        });
      } else {
        completedReservations.push({
          ...commonDetails,
          link: `/res_info/${res._id}?userId=${userId}&baseId=${user._id}`
        });
      }
    });

    res.render('view', {
      title: 'View Reservations',
      userRole: user.role,
      isView: true,
      userId: userId,
      baseId: baseId,
      user,
      currentReservations,
      completedReservations
    });

  } catch (err) {
    console.error(err);
    return res.send(`<script>alert("Server Error.");window.history.back();</script>`);
  }
};

// Helper to convert "1400" to { hours: 14, minutes: 0 }
function parseTime(timeStr) {
  return {
    hours: parseInt(timeStr.slice(0, 2), 10),
    minutes: parseInt(timeStr.slice(2), 10)
  };
}

// Helper to format time ranges like "0900 - 1030"
function formatTimeRange(start, end) {
  return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
}

function formatSingleTime(timeStr) {
  const h = parseInt(timeStr.slice(0, 2), 10);
  const m = timeStr.slice(2);
  return `${h.toString().padStart(2, '0')}:${m}`;
}
