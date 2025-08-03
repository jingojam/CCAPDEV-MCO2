const Lab = require('../model/labRegistry');
const User = require('../model/userRegistry');

exports.renderCreatePage = async (req, res) => {
  try {
    const labs = await Lab.find();
    console.log(req.query);
    const baseId = req.query.baseId;
    const userId = req.query.userId;
    
    if(!userId || !baseId){
      return res.send(`<script>alert("Ids not found."); window.history.back();</script>`);
    }

    const user = await User.findById(baseId).lean();

    const isTechnician = user.role === 'TECHNICIAN';

    const laboratories = labs.map((lab) => {

      return {
        name: lab.lab_name,
        sched: lab.lab_sched?.map(d => new Date(d).toDateString()),
        link: `/laboratory/${lab.lab_id}?userId=${userId}&baseId=${baseId}`
      };
    });

    res.render('create', {
      title: 'Create Reservation',
      userRole: user.role,
      isTechnician,
      isCreate: true,
      userId: userId,
      baseId: baseId,
      user,
      laboratories
    });

  } catch (error) {
    console.error('Error loading create page:', error);
    return res.send(`
      <script>
        alert("Error loading create page: ${error}");
        window.history.back();
      </script>
    `);
  }
};