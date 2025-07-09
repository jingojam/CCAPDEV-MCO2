exports.renderCreatePage = (req, res) => {
  res.render('create', {
    title: 'Create Reservation',
    userRole: 'STUDENT',
    isCreate: true
  });
};