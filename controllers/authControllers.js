const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.send(`<script>alert("Id's not found."); window.history.back();</script>`);
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