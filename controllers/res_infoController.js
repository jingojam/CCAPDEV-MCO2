const User = require('../model/userRegistry'); // adjust path

exports.renderInfoPage = async (req, res) => {  
  try{
    const userId = req.query.userId;

    if(!userId){
      return res.status(400).send('No userId parameter set');
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses

    if(!user){
      return res.status(404).send('No user found');
    }

    res.render('res_info', {
      title: 'Info - Reservation',
      userRole: user.role,
      isResInfo: true,
      user
    });
  } catch(err){
    console.log(err);
    res.status(500).send('Server Error');
  }
};