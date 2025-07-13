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
      userRole: user.role,
      isProfileEdit: true,
      user
    });
  } catch(err){
    console.error(err);
    res.status(500).send('Error loading profile info');
  }
};

// POST for deleting user
exports.deleteProfile = async (req, res) => {
  try{
    const userId = req.body.userId;

    if(!userId){
      return res.status(400).send('Missing userId in query');
    }

    const deleteUser = await User.findByIdAndDelete(userId);

    if(!deleteUser){
      return res.status(404).send('User cannot be found');
    }

    return res.redirect('/login');
  } catch(err){
    console.log(err);
    res.status(500).send('Error deleting profile');
  }
};

// POST for editing name
exports.saveEdit = async (req, res) => {
  try {
    const data = req.body;
    const userId = data.userId;

    if (!userId) {
      return res.status(400).send('No user Id found');
    }

    //update fields
    const updateFields = {
      first_name: data.first_name,
      last_name: data.last_name,
      description: data.description
    };

    // if custom profile pic exists
    if (data.profile_pic_base64 && data.profile_pic_base64.trim() !== '') {
      updateFields.profileImage = {
        data: Buffer.from(data.profile_pic_base64, 'base64'),
        contentType: 'image/jpeg' 
      };
    }

    // update
    const updateUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).send('User cannot be found');
    }

    return res.redirect(`/prof_edit?userId=${userId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving profile');
  }
};
