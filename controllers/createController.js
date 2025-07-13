const Lab = require('../model/labRegistry');
const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  try {
    const labs = await Lab.find();
    const userId = req.query.userId;
    const user = await User.findById(userId).lean();

    const laboratories = labs.map((lab) => {
      let occupied = 0;

      for (let seat = 0; seat < lab.seats.length; seat++) {
        if (!lab.seats[seat].availability) {
          occupied++;
        }
      }

      const total = lab.seats.length;

      return {
        name: lab.lab_name,
        sched: lab.lab_sched?.map(d => new Date(d).toDateString()),
        occupancy: `${occupied} / ${total} occupied`,
        // 🔗 Append userId in the lab link
        link: `/laboratory/${lab.lab_id}?userId=${user._id}`
      };
    });

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toDateString();
    });

    const startTimes = [
      { value: "09:00", label: "9:00 AM" },
      { value: "10:00", label: "10:00 AM" },
      { value: "11:00", label: "11:00 AM" },
    ];

    const endTimes = [
      { value: "12:00", label: "12:00 PM" },
      { value: "13:00", label: "1:00 PM" },
      { value: "14:00", label: "2:00 PM" },
    ];

    res.render('create', {
      title: 'Create Reservation',
      userRole: user.role,
      isCreate: true,
      user,
      days,
      startTimes,
      endTimes,
      laboratories
    });

  } catch (error) {
    console.error('Error loading create page:', error);
    res.status(500).send('Internal Server Error');
  }
};