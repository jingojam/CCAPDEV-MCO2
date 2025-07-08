exports.renderViewPage = (req, res) => {
  res.render('view', {
    title: 'View Reservations',
    userRole: 'STUDENT',
    isView: true
  });
};

// Route list of reservations


// Sample data for visualization

exports.renderViewPage = (req, res) => {
  res.render('view', {
    title: 'View Reservations',
    userRole: 'STUDENT',
    isView: true,

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
};
