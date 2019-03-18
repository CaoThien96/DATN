const routes = require('express').Router();
const lodash = require('lodash');
const CheckIn = require('./model');
const CheckInDetail = require('./model/check_in_detail');
const compareYMD = (date1, date2) => {};
routes.post('/', async (req, res) => {
  const checkInDetail = await CheckInDetail.find({
    'user.iid': 1011,
  });
  const tmpCheckIn = lodash.find(checkInDetail, el => {
    const createAt = el.created_at;
    const todayDate = new Date();
    const date1 = {
      y: todayDate.getFullYear(),
      m: todayDate.getMonth(),
      d: todayDate.getDate(),
    };
    const date2 = {
      y: createAt.getFullYear(),
      m: createAt.getMonth(),
      d: createAt.getDate(),
    };
    if (JSON.stringify(date1) === JSON.stringify(date2)) {
      return true;
    }
    return false;
  });
  console.log({ tmpCheckIn });
});
routes.put('/', async (req, res) => {
  const { userIid, statusCheckIn } = req.body;
  const checkInDetail = await CheckInDetail.find({
    'user.iid': userIid,
  });
  const tmpCheckIn = lodash.find(checkInDetail, el => {
    const createAt = el.created_at;
    const todayDate = new Date();
    const date1 = {
      y: todayDate.getFullYear(),
      m: todayDate.getMonth(),
      d: todayDate.getDate(),
    };
    const date2 = {
      y: createAt.getFullYear(),
      m: createAt.getMonth(),
      d: createAt.getDate(),
    };
    if (JSON.stringify(date1) === JSON.stringify(date2)) {
      return true;
    }
    return false;
  });
  const id = tmpCheckIn._id;
  CheckInDetail.update(
    { _id: tmpCheckIn._id },
    { status: statusCheckIn },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    },
  );
});
module.exports = routes;
