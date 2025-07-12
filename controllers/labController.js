const Lab = require('../model/labRegistry');
const User = require('../model/userRegistry');

exports.renderLabPage = async (req, res) => {
  try{
    const id = req.params.id;
    const lab = await Lab.findOne({lab_id: id});
    const userId = req.query.userId;
    const user = await User.findById(userId).lean();

    if(!lab){
      res.status(404).send(`/laboratory/:${id} Not Found.`);
      return;
    }

    res.render('laboratory', {
      labname: lab.lab_name,
      days: lab.lab_sched?.map(d => new Date(d).toDateString()),
      isLab: true,
      user
    })
  } catch (error) {
    console.error('Error loading labs:', error);
    res.status(500).send('Internal Server Error');
  }
};