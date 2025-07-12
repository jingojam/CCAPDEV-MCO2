const Lab = require('../model/labRegistry');

exports.renderLabPage = async (req, res) => {
  try{
    const id = req.params.id;
    const lab = await Lab.findOne({lab_id: id});

    if(!lab){
      res.status(404).send(`/laboratory/:${id} Not Found.`);
      return;
    }

    res.render('laboratory', {
      labname: lab.lab_name,
      days: lab.lab_sched?.map(d => new Date(d).toDateString()),
      isLab: true
    })
  } catch (error) {
    console.error('Error loading labs:', error);
    res.status(500).send('Internal Server Error');
  }
};