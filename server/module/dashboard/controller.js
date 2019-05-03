const CheckIn = require('../checkin/model');
const CheckInDetail = require('../checkin/model/check_in_detail');
module.exports.handleGetWarningEmployee = (req, res) => {
  const { start, end } = req.params;
  console.log({ start, end });
  CheckIn.searchCheckInByRange(start, end, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    if (docs === null) {
      return res.status(500).send({
        success: false,
        err: 'Khong tim thay phien checkin nao',
      });
    }
    const listPid = docs.map(el => el.iid);
    console.log(listPid);
    CheckInDetail.aggregate([
      {
        $match: { pid: { $in: listPid } },
      },
      {
        $group: {
          _id: { iid: '$user.iid', email: '$user.email' },
          created_at: { $push: {created_at:'$created_at',status:'$status'} },
        },
      },
    ]).exec((err, docs) => {
      console.log({ docs });
      if(err){
        return res.send({
          success:false,
          err,
        })
      }
      return res.send({success:true,payload:docs});
    });
  });
};
