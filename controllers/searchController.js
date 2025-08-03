const User = require('../model/userRegistry');
const ErrorList = require('../model/errorRegistry'); 

exports.searchFunction = async (req, res) => {
  try {
    const fullName = req.body.full_name.trim();
    const baseId = req.body.baseId;
    const userId = req.body.userId;

    if (!userId || !baseId) {
      await ErrorList.create({
        error: 'Missing userId or baseId in body.',
        route: req.originalUrl,
        userEmail: 'unknown'
      });

      return res.status(400).send('Ids not found');
    }

    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');

    if (!firstName || !lastName) {
      await ErrorList.create({
        error: `Invalid full name input: "${fullName}"`,
        route: req.originalUrl,
        userEmail: userId
      });

      return res.send(`
        <script>
          alert("Please enter both first and last name.");
          window.history.back();
        </script>
      `);
    }

    const user = await User.findOne({
      first_name: new RegExp('^' + firstName + '$', 'i'),
      last_name: new RegExp('^' + lastName + '$', 'i')
    });

    if (!user) {
      await ErrorList.create({
        error: `Search failed: ${firstName} ${lastName} not found.`,
        route: req.originalUrl,
        userEmail: userId
      });

      return res.send(`
        <script>
          alert("User with that name not found.");
          window.history.back();
        </script>
      `);
    }

    return res.redirect(`/prof_info?userId=${user._id}&baseId=${baseId}`);
  } catch (err) {
    console.error(err);
    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      userEmail: req.body.userId || 'unknown'
    });

    return res.send(`
      <script>
        alert("An error occurred while searching. Please try again.");
        window.history.back();
      </script>
    `);
  }
};

exports.find = async (req, res) => {
  try {
    const fullName = req.body.full_name.trim();
    const baseId = req.body.baseId;
    const userId = req.body.userId;

    if (!userId || !baseId) {
      await ErrorList.create({
        error: 'Missing userId or baseId in body.',
        route: req.originalUrl,
        userEmail: 'unknown'
      });

      return res.status(400).send('Ids not found');
    }

    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');

    if (!firstName || !lastName) {
      await ErrorList.create({
        error: `Invalid full name input: "${fullName}"`,
        route: req.originalUrl,
        userEmail: userId
      });

      return res.send(`
        <script>
          alert("Please enter both first and last name.");
          window.history.back();
        </script>
      `);
    }

    const user = await User.findOne({
      first_name: new RegExp('^' + firstName + '$', 'i'),
      last_name: new RegExp('^' + lastName + '$', 'i')
    });

    if (!user) {
      await ErrorList.create({
        error: `Search failed: ${firstName} ${lastName} not found.`,
        route: req.originalUrl,
        userEmail: userId
      });

      return res.send(`
        <script>
          alert("User with that name not found.");
          window.history.back();
        </script>
      `);
    }

    return res.redirect(`/create?userId=${user._id}&baseId=${baseId}`);
  } catch (err) {
    console.error(err);
    await ErrorList.create({
      error: err.message,
      stack: err.stack,
      route: req.originalUrl,
      userEmail: req.body.userId || 'unknown'
    });

    return res.send(`
      <script>
        alert("An error occurred while searching. Please try again.");
        window.history.back();
      </script>
    `);
  }
};
