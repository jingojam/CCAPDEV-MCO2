const User = require('../model/userRegistry');

exports.renderHomePage = async (req, res) => {
  const baseId = req.query.baseId;
  const userId = req.query.userId;

  console.log(req.query);

  if(!userId || !baseId){
    return res.status(400).send('Ids not found');
  }

  const user = await User.findById(baseId).lean();

  res.render('home', {
    title: 'Home Page',
    userRole: user.role,
    isHome: true,
    userId: userId,
    baseId: baseId
  });
};
