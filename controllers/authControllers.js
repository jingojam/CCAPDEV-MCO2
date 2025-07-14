const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const user = await User.findById(baseId).lean();

    res.render('create', {
      title: 'Create Reservation',
      userRole: user.role,
      isCreate: true,
      user
    });
  } catch(err){
    console.log(err);
  }
};