

exports.renderEditPage = (req, res) => {
  res.render('prof_edit', {
    title: 'Edit Profile Info',
    userRole: 'STUDENT',
    isProfileEdit: true
  });
};