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
        date: "07 / 07 / 2025",
        time: "10:00 - 11:00",
        laboratory: "Laboratory A1",
        seat: "Seat 01",
        requestDate: "07 / 06 / 2025 09:30"
      },
      {
        date: "07 / 08 / 2025",
        time: "14:00 - 15:00",
        laboratory: "Laboratory B2",
        seat: "Seat 12",
        requestDate: "07 / 07 / 2025 08:45"
      }
    ],

    completedReservations: [
      {
        date: "06 / 20 / 2025",
        time: "09:00 - 10:00",
        laboratory: "Laboratory C3",
        seat: "Seat 22",
        requestDate: "06 / 18 / 2025 12:00"
      },
      {
        date: "06 / 15 / 2025",
        time: "13:00 - 14:30",
        laboratory: "Laboratory D4",
        seat: "Seat 08",
        requestDate: "06 / 13 / 2025 14:10"
      }
    ]
  });
};
