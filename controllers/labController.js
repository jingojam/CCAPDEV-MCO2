exports.renderLabPage = (req, res) => {
  res.render('laboratory', {
    title: 'Lab x',
    userRole: 'STUDENT',
    isHome: false
  });
};

const dummyLabData = {
    title: 'Reserve a Lab',
    labname: 'Computer Science Lab A',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTimes: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    endTimes: ['09:00', '10:00', '11:00', '12:00', '13:00'],
    seats: [
        { seatNumber: 'A1', vacancy: 'Available', reserveText: 'Reserve' },
        { seatNumber: 'A2', vacancy: 'Occupied', reserveText: 'Unavailable' },
        { seatNumber: 'A3', vacancy: 'Available', reserveText: 'Reserve' }
    ]
};
