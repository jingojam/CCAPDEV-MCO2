const User = require('../model/userRegistry'); // adjust path as needed

exports.renderEditPage = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }
    const user = await User.findById(baseId).lean();

    res.render('prof_edit', {
      title: 'Edit Profile Info',
      userRole: user.role,
      isProfileEdit: true,
      userId: userId,
      baseId: baseId,
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
    const baseId = req.body.baseId;
    const userId = req.body.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const deleteUser = await User.findByIdAndDelete(baseId);

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
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
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
      baseId,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).send('User cannot be found');
    }

    return res.redirect(`/prof_edit?userId=${userId}&baseId=${baseId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving profile');
  }
};
