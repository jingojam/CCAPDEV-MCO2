const User = require('../model/userRegistry'); 
const Reservation = require('../model/reserveRegistry'); 
const ErrorList = require('../model/errorRegistry');

// GET: Render profile edit page
exports.renderEditPage = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;
    
    const errorMessage = "Id is not found.";
    
    if (!baseId || !(/^[0-9a-fA-F]{24}$/.test(baseId))) {
      throw new Error(errorMessage);
    }
    if (!userId || !(/^[0-9a-fA-F]{24}$/.test(userId))) {
      throw new Error(errorMessage);
    }

    const user = await User.findById(baseId).lean();
    const viewUser = await User.findById(userId).lean();

    if (!user || !viewUser) {
      throw new Error(errorMessage);
    }

    res.render('prof_edit', {
      title: 'Edit Profile Info',
      userRole: user.role,
      isProfileEdit: true,
      userId,
      baseId,
      user
    });
  } catch (err) {
    console.error(err);
    await ErrorList.create({
      error: "Id is not found.",
      stack: err.stack,
      route: req.originalUrl,
      user: req.query.baseId
    });
    return res.send(`<script>alert("Id is not found."); window.history.back();</script>`);
  }
};

// POST: Delete user and related reservations
exports.deleteProfile = async (req, res) => {
  try {
    const baseId = req.query.baseId;
    const userId = req.query.userId;
    const errorMessage = "Id is not found.";

    if (!baseId || !(/^[0-9a-fA-F]{24}$/.test(baseId))) {
      throw new Error(errorMessage);
    }

    const deleteUser = await User.findByIdAndDelete(baseId);

    if (!deleteUser) {
      throw new Error(errorMessage);
    }

    await Reservation.deleteMany({ belongsTo: baseId });

    return res.redirect('/auth_ref/Welcome.html');
  } catch (err) {
    console.error(err);
    await ErrorList.create({
      error: "Error deleting profile.",
      stack: err.stack,
      route: req.originalUrl,
      user: req.query.baseId
    });
    return res.send(`<script>alert("Error deleting profile."); window.history.back();</script>`);
  }
};

// POST: Save profile edits
exports.saveEdit = async (req, res) => {
  try {
    const baseId = req.body.baseId;
    const userId = req.body.userId;
    const errorMessage = "Id is not found.";

    if (!baseId || !(/^[0-9a-fA-F]{24}$/.test(baseId))) {
      throw new Error(errorMessage);
    }

    const data = req.body;

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
      throw new Error(errorMessage);
    }

    return res.redirect(`/prof_edit?userId=${userId || baseId}&baseId=${baseId}`);
  } catch (err) {
    console.error(err);
    await ErrorList.create({
      error: "Error saving profile.",
      stack: err.stack,
      route: req.originalUrl,
      user: req.body.baseId
    });
    return res.send(`<script>alert("Error saving profile."); window.history.back();</script>`);
  }
};
