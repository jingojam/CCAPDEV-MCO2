exports.renderLabPage = (req, res) => {
  res.render('laboratory', {
    title: 'Lab x',
    userRole: 'STUDENT',
    isHome: false
  });
};