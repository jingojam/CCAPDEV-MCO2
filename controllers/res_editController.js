const User = require('../model/userRegistry'); // adjust path

exports.renderEditPage = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const user = await User.findById(baseId).lean(); // or whatever your DB uses

    if(!user){
      return res.status(404).send('No user found');
    }

    res.render('res_edit', {
      title: 'Edit - Reservation',
      userRole: user.role,
      isResEdit: true,
      userId: userId,
      baseId: baseId,
      user
    });
  } catch(err){
    console.log(err);
    res.status(500).send('Server Error');
  }
};

