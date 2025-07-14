const User = require('../model/userRegistry');
const Reservation = require('../model/reserveRegistry');

exports.searchFunction = async (req, res) => {
  try {
    const fullName = req.body.full_name.trim();
    console.log(req.query);
    const baseId = req.body.baseId;
    const userId = req.body.userId;

    if(!userId || !baseId){
      return res.status(400).send('Ids not found');
    }

    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');

    if (!firstName || !lastName) {
      return res.send(`
        <script>
          alert("Please enter both first and last name.");
          window.history.back();
        </script>
      `);
    }

    const user = await User.findOne({
      first_name: new RegExp('^' + firstName + '$', 'i'),   // case insensitive
      last_name: new RegExp('^' + lastName + '$', 'i')
    });

    if (!user) {
      return res.send(`
        <script>
          alert("User with that name not found.");
          window.history.back();
        </script>
      `);
    }

    if(userId != baseId){
      //some loguic
    }
    // Redirect to profile using user._id
    return res.redirect(`/prof_info?userId=${user._id}&baseId=${baseId}`);
  } catch (err) {
    console.error(err);
    return res.send(`
      <script>
        alert("An error occurred while searching. Please try again.");
        window.history.back();
      </script>
    `);
  }
};
