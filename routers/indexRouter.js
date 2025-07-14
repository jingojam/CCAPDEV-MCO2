const express = require('express');
const router  = express.Router();
const User    = require('../model/userRegistry'); // Mongoose model

router.get('/', async (req, res, next) => {
  try {
    // Use any unique field that survives reseeding
    const student = await User.findOne({ email: 'john.doe@dlsu.edu.ph' }).lean();
    const tech    = await User.findOne({ email: 'admin.user@dlsu.edu.ph' }).lean();

    if (!student || !tech) {
      return res.status(500).send('Seed users not found.'); // or seed them on the fly
    }

    res.render('index', {
      studentId: student._id.toString(),
      techId:    tech._id.toString()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
