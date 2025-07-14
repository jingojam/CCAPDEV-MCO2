const User = require('../model/userRegistry'); // adjust path

exports.renderEditPage = async (req, res) => {
  try{
    const userId = req.query.userId;

    if(!userId){
          return res.send(`
      <script>
        alert("UserId doesn't exist.");
        window.history.back();
      </script>
    `);
    }

    const user = await User.findById(userId).lean(); // or whatever your DB uses

    if(!user){
      return res.send(`
      <script>
        alert("No user found.");
        window.history.back();
      </script>
    `);
    }

    res.render('res_edit', {
      title: 'Edit - Reservation',
      userRole: user.role,
      isResEdit: true,
      user
    });
  } catch(err){
    console.log(err);
    res.status(500).send('Server Error');
  }
};

