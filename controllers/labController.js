const User = require('../model/userRegistry');
const Lab = require('../model/labRegistry');

exports.renderLabPage = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    const lab = await Lab.findOne({ lab_id: id });
    if (!lab) {
      res.status(404).send(`Lab with ID ${id} not found.`);
      return;
    }

    let user = null;
    if (userId) {
      try {
        user = await User.findById(userId).lean();
      } catch (err) {
        console.warn('Invalid userId:', userId);
      }
    }

    const days = lab.lab_sched?.map(d => new Date(d).toDateString()) || [];

    const startTimes = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"
    ];

    const endTimes = [
      "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"
    ];

    const seats = lab.seats.map(seat => ({
      seatNumber: `Seat ${seat.seat_num.toString().padStart(2, '0')}`,
      vacancy: seat.availability ? 'Available' : 'Occupied',
      reserveText: seat.availability ? 'Reserve' : 'Unavailable'
    }));

    res.render('laboratory', {
      labId: id,
      labname: lab.lab_name,
      days,
      startTimes,
      endTimes,
      seats,
      isLab: true,
      userId,
      user
    });
  } catch (error) {
    console.error('Error rendering lab page:', error);
    res.status(500).send('Internal Server Error');
  }
};