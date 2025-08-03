const User = require('../model/userRegistry');
const Resv = require('../model/reserveRegistry');

function generateTimeOptions(startHour, endHour, includeHalfHour, isEnd = false) {
  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m of [0, 30]) {
      if (!includeHalfHour && m === 30) continue;
      const value = `${h.toString().padStart(2, '0')}${m === 0 ? '00' : '30'}`;
      const label = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
      if (isEnd && value === "0900") continue;
      times.push({ value, label });
    }
  }
  return times;
}

exports.renderEditPage = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const userId = req.query.userId;
    const baseId = req.query.baseId;

    if (!userId || !baseId) {
      return res.status(400).send('Ids missing in query');
    }

    const user = await User.findById(baseId).lean();
    const resv = await Resv.findById(reservationId).lean();

    const selectedDate = new Date(resv.lab_sched).toISOString().split('T')[0];
    const selectedStart = resv.startTime;
    const selectedEnd = resv.endTime;
    const selectedLab = resv.lab_name;
    const selectedSeat = String(resv.seat);
    const requestTime = new Date(resv.requestDate).toISOString();

    const startTimes = generateTimeOptions(9, 15, true);
    const endTimes = generateTimeOptions(9, 16, true, true);
    const seats = Array.from({ length: 35 }, (_, i) => `${i + 1}`);

    res.render('res_edit', {
      title: 'Edit - Reservation',
      isResEdit: true,
      userId,
      baseId,
      user,
      userRole: user.role,
      reservationId,
      selectedDate,
      selectedStart,
      selectedEnd,
      selectedLab,
      selectedSeat,
      requestTime,
      startTimes,
      endTimes,
      seats,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.submitEdit = async (req, res) => {
  try {
    const { timeStart, timeEnd, seat } = req.body;
    const reservationId = req.params.reservationId;

    const current = await Resv.findById(reservationId).lean();
    if (!current) return res.status(404).json({ message: 'Reservation not found' });

    const { lab_sched, lab_name, account_id } = current;

    // Check for other reservations by same student on same day that overlap
    const studentConflict = await Resv.findOne({
      _id: { $ne: reservationId },
      account_id: account_id,
      lab_sched: lab_sched,
      $or: [
        { startTime: { $lt: timeEnd }, endTime: { $gt: timeStart } }
      ]
    });

    if (studentConflict) {
      return res.status(409).json({
        message: 'There is a reservation that overlaps on this date and time.'
      });
    }

    // Check for seat+lab+time conflict with other users
    const seatConflict = await Resv.findOne({
      _id: { $ne: reservationId },
      lab_sched: lab_sched,
      lab_name: lab_name,
      seat: seat,
      $or: [
        { startTime: { $lt: timeEnd }, endTime: { $gt: timeStart } }
      ]
    });

    if (seatConflict) {
      return res.status(409).json({
        message: `Seat ${seat} in ${lab_name} is already taken on that time.`
      });
    }

    const reservation = await Resv.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    const now = Date.now();
    const request = new Date(reservation.lab_sched);
    const start = reservation.startTime;

    let hours = parseInt(start.substring(0, 2), 10);
    let minutes = parseInt(start.substring(2, 4), 10);
    request.setHours(hours);
    request.setMinutes(minutes);
    request.setSeconds(0, 0);

    const oneHourBefore = request.getTime() - 60 * 60 * 1000;
    const canEdit = now <= oneHourBefore;

    if (!canEdit) {
      return res.status(403).json({
        message: "You cannot edit this reservation anymore."
      });
    }

    await Resv.findByIdAndUpdate(reservationId, {
      startTime: timeStart,
      endTime: timeEnd,
      seat: seat
    });

    res.json({ message: 'Reservation updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while saving.' });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const baseId = req.query.baseId;

    if (!reservationId || !baseId) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    const [user, reservation] = await Promise.all([
      User.findById(baseId).lean(),
      Resv.findById(reservationId).lean()
    ]);

    if (!user || !reservation) {
      return res.status(404).json({ message: 'User or Reservation not found.' });
    }

    const startStr = reservation.startTime;
    const schedDate = new Date(reservation.lab_sched);
    schedDate.setHours(+startStr.slice(0, 2));
    schedDate.setMinutes(+startStr.slice(2));
    schedDate.setSeconds(0, 0);

    const now = Date.now();
    let canDelete = false;

    if (user.role === 'TECHNICIAN') {
      canDelete = now <= schedDate.getTime() + 10 * 60 * 1000;
    } else if (user.role === 'STUDENT') {
      canDelete = now <= schedDate.getTime() - 60 * 60 * 1000;
    }

    if (!canDelete) {
      return res.status(403).json({ message: 'You are no longer allowed to delete this reservation.' });
    }

    await Resv.findByIdAndDelete(reservationId);

    return res.json({ message: 'Reservation deleted successfully.' });

  } catch (err) {
    console.error('deleteReservation error:', err);
    return res.status(500).json({ message: 'Something went wrong while deleting.' });
  }
};
