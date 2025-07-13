const User = require('../model/userRegistry');
const Lab = require('../model/labRegistry');

// Sample data for visualization

exports.renderViewPage = async (req, res) => {
  try{
    const userId = req.query.userId;

    if(!userId){
      return res.status(400).send('userId parameter missing');
    }

    const user = await User.findById(userId).lean();

    res.render('view', {
      title: 'View Reservations',
      userRole: user.role,
      isView: true,
      user,

      currentReservations: [
        {
          date: "xx / xx / xxxx",
          time: "XX:00 - XX:00",
          laboratory: "Laboratory XX",
          seat: "Seat XX",
          requestDate: "XX / XX / XXXX XX:00"
        },
        {
          date: "xx / xx / xxxx",
          time: "XX:00 - XX:00",
          laboratory: "Laboratory XX",
          seat: "Seat XX",
          requestDate: "XX / XX / XXXX XX:00"
        }
      ],

      completedReservations: [
        {
          date: "xx / xx / xxxx",
          time: "XX:00 - XX:00",
          laboratory: "Laboratory XX",
          seat: "Seat XX",
          requestDate: "XX / XX / XXXX XX:00"
        },
        {
          date: "xx / xx / xxxx",
          time: "XX:00 - XX:00",
          laboratory: "Laboratory XX",
          seat: "Seat XX",
          requestDate: "XX / XX / XXXX XX:00"
        }
      ]
    });

  } catch(err){
    console.error(err);
    res.status(500).send('Server Error');
  }
};
