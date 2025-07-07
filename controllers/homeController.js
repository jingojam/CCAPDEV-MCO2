exports.renderHomePage = (req, res) => {
  res.render('home', {
    title: 'Home Page',
    userRole: 'STUDENT',
    isHome: true
  });
};
