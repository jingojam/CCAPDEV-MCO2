const User = require('../model/userRegistry'); // adjust path

exports.renderEditPage = async (req, res) => {
  try{
    const userId = req.query.userId;

    if(!userId){
      return res.status(400).send('No userId parameter set');
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses

    if(!user){
      return res.status(404).send('No user found');
    }

    res.render('res_edit', {
      title: 'Edit Reservation',
      userRole: 'STUDENT',
      isResEdit: true,
      user
    });
  } catch(err){
    console.log(err);
    res.status(500).send('Server Error');
  }
};

