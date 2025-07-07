exports.renderViewPage = (req, res) => {
  res.render('view', {
    title: 'View Reservations',
    userRole: 'STUDENT',
    isView: true
  });
};

// Route list of reservations


