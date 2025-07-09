
exports.renderEditPage = (req, res) => {
  res.render('prof_info', {
    title: 'View Profile Info',
    userRole: 'STUDENT',
    isProfileInfo: true
  });
};