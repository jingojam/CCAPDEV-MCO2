const User = require('../model/userRegistry'); // adjust path as needed

exports.renderEditPage = async (req, res) => {
  try{
    const userId = req.query.userId;

    if(!userId){
      return res.status(400).send('Missing userId in query');
    }

    const user = await User.findById(userId).lean();

    res.render('prof_edit', {
      title: 'Edit Profile Info',
      userRole: 'STUDENT',
      isProfileEdit: true,
      user
    });
  } catch(err){
    console.error(err);
    res.status(500).send('Error loading profile info');
  }
};