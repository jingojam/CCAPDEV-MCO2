const User = require('../model/userRegistry'); 

exports.renderEditPage = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.send(`<script>alert("Id's not found."); window.history.back();</script>`);
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
    return res.send(`<script>alert("Error loading profile info."); window.history.back();</script>`);
  }
};

// POST for deleting user
exports.deleteProfile = async (req, res) => {
  try{
    const baseId = req.query.baseId;
    const userId = req.query.userId;

    if(!userId || !baseId){
      return res.send(`<script>alert("Id's not found."); window.history.back();</script>`);
    }

    const deleteUser = await User.findByIdAndDelete(baseId);

    if(!deleteUser){
      return res.send(`<script>alert("User can't be found."); window.history.back();</script>`);
    }

    return res.redirect('/auth_ref/Welcome.html');
  } catch(err){
    console.log(err);
    return res.send(`<script>alert("Error deleting profile."); window.history.back();</script>`);
  }
};

// POST for editing info
exports.saveEdit = async (req, res) => {
  try {
    const baseId = req.body.baseId;
    const userId = req.body.userId;

    if (!baseId || !userId) {
      return res.send(`<script>alert("Ids not found."); window.history.back();</script>`);
    }

    const data = req.body;

    // Update fields
    const updateFields = {
      first_name: data.first_name,
      last_name: data.last_name,
      description: data.description
    };

    if (data.profile_pic_base64 && data.profile_pic_base64.trim() !== '') {
      updateFields.profileImage = {
        data: Buffer.from(data.profile_pic_base64, 'base64'),
        contentType: 'image/jpeg'
      };
    }

    const updateUser = await User.findByIdAndUpdate(
      baseId,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res.send(`<script>alert("User can't be found."); window.history.back();</script>`);
    }

    return res.redirect(`/prof_edit?userId=${userId || baseId}&baseId=${baseId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving profile');
  }
};
