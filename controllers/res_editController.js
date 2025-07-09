
exports.renderEditPage = (req, res) => {
  res.render('res_edit', {
    title: 'Edit Reservation',
    userRole: 'STUDENT',
    isResEdit: true
  });
};

