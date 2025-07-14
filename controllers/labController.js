const User = require('../model/userRegistry');
const Lab = require('../model/labRegistry');
const Reservation = require('../model/reserveRegistry');


exports.renderLabPage = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;

    const lab = await Lab.findOne({ lab_id: id }).lean();
    if (!lab) {
      return res.send(`
      <script>
        alert("Lab with ID ${id} not found.");
        window.history.back();
      </script>
    `);
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

    // The labels can be changed based on if we want AM/PM or Military Time
    const startTimes = [
      { value: "0900", label: "09:00" },
      { value: "0930", label: "09:30" },
      { value: "1000", label: "10:00" },
      { value: "1030", label: "10:30" },
      { value: "1100", label: "11:00" },
      { value: "1130", label: "11:30" },
      { value: "1200", label: "12:00" },
      { value: "1230", label: "12:30" },
      { value: "1300", label: "13:00" },
      { value: "1330", label: "13:30" },
      { value: "1400", label: "14:00" },
      { value: "1430", label: "14:30" },
      { value: "1500", label: "15:00" },
      { value: "1530", label: "15:30" }
    ];

    const endTimes = [
      { value: "0930", label: "09:30" },
      { value: "1000", label: "10:00" },
      { value: "1030", label: "10:30" },
      { value: "1100", label: "11:00" },
      { value: "1130", label: "11:30" },
      { value: "1200", label: "12:00" },
      { value: "1230", label: "12:30" },
      { value: "1300", label: "13:00" },
      { value: "1330", label: "13:30" },
      { value: "1400", label: "14:00" },
      { value: "1430", label: "14:30" },
      { value: "1500", label: "15:00" },
      { value: "1530", label: "15:30" },
      { value: "1600", label: "16:00" }
    ];

    const seats = lab.seats.map(seat => ({
      seatNumber: `Seat ${seat.seat_num.toString().padStart(2, '0')}`,
      vacancy: seat.availability ? 'Available' : 'Occupied',
      reserveText: seat.availability ? 'Reserve' : 'Unavailable'
    }));

    // Fetch existing reservations for this lab
    const reservations = await Reservation.find({ laboratory: lab.lab_name });

    
    res.render('laboratory', {
      userRole: user.role,
      labId: id,
      lab,
      days,
      startTimes,
      endTimes,
      seats,
      isLab: true,
      userId,
      user,
      reservations
    });
  } catch (error) {
    console.error('Error rendering lab page:', error);
    res.status(500).send('Internal Server Error');
  }
};

// POST method for making a reservation
exports.reserveLab = async (req, res) => {

};