const express = require('express');
const router = express.Router();
const User = require('../model/userRegistry');

// GET /prof_info?userId=123
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send("Missing user ID");

    const user = await User.findById(userId).populate('lab_reservations');
    if (!user) return res.status(404).send("User not found");

    const userData = {
      name: `${user.first_name} ${user.last_name}`,
      image: user.profile_pic_url,
      bio: user.descrption
    };

    const reservations = user.lab_reservations.map(lab => ({
      lab: lab.name || 'N/A',
      seat: lab.seat || 'N/A',
      datetime: lab.datetime || 'N/A'
    }));

    res.render('prof_info', {
      user: userData,
      reservations
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send("Error.");
  }
});

module.exports = router;
