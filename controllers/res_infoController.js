
exports.renderEditPage = (req, res) => {
  res.render('res_info', {
    title: 'Reservation Info',
    userRole: user.role,
    isResEdit: true
  });
};