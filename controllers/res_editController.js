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

    if(!userId || !baseId){
      res.status(400).send('Ids missing in query');
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
      userId: userId,
      baseId: baseId,
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

    const conflict = await Resv.findOne({
      _id: { $ne: reservationId },
      lab_name: current.lab_name,
      lab_sched: current.lab_sched,
      seat: seat,
      $or: [
        { startTime: { $lt: timeEnd }, endTime: { $gt: timeStart } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ message: 'Conflict detected: Another reservation exists at that time and seat.' });
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

    const user = await User.findById(baseId);

    var time;

    if(user.role === "TECHNICIAN"){
      const now = Date.now();
      var reservation = await Resv.findById(reservationId);
      time = 10*60*1000
      const startTime = new Date(reservation.startTime).getTime();

    } else{
      time = 60*60*100;
    }

    if(now < startTime || now > startTime + time){
        return res.send(`
          <script>
            You must wait at least 10 minutes after the start time of the laboratory.
          </script>
        `);
      }
    
      reservation = await Resv.findByIdAndDelete(reservationId);

    res.json({ message: 'Reservation deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while deleting.' });
  }
};
