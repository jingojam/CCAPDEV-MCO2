const Lab = require('../model/labRegistry');
const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  try {
    const labs = await Lab.find();
    console.log(req.query);
    const baseId = req.query.baseId;
    const userId = req.query.userId;
    
    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const user = await User.findById(baseId).lean();

    const isTechnician = user.role === 'TECHNICIAN';

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
        link: `/laboratory/${lab.lab_id}?userId=${userId}&baseId=${baseId}`
      };
    });

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toDateString();
    });

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

    res.render('create', {
      title: 'Create Reservation',
      userRole: user.role,
      isTechnician,
      isCreate: true,
      userId: userId,
      baseId: baseId,
      user,
      days,
      startTimes,
      endTimes,
      laboratories
    });

  } catch (error) {
    console.error('Error loading create page:', error);
    return res.send(`
      <script>
        alert("Error loading create page: ${error}");
        window.history.back();
      </script>
    `);
  }
};