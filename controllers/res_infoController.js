
exports.renderEditPage = (req, res) => {
  res.render('res_info', {
    title: 'Reservation Info',
    userRole: 'STUDENT',
    isResEdit: true
  });
};