const CronJob = require('cron').CronJob;
const moment = require('moment')
const User = require('../module/employee/model');
const Configuration = require('../module/configuration/model');
const CheckIn = require('../module/checkin/model');
const CheckInDetail = require('../module/checkin/model/check_in_detail');
async function createCheckin() {
  try {
    const users = await User.find({ role: 1000, status: 1 });
    const newCheckIn = new CheckIn();
    newCheckIn.date = new Date();
    CheckIn.create({ date: new Date().getTime() }, (err, candies) => {
      if (err) {
        console.log({ err });
      } else {
        const newCheckInDetail = users.map(el => ({
          user: el,
          pid: candies.iid,
        }));
        CheckInDetail.insertMany(newCheckInDetail, (error, docs) => {
          if (err) {
            console.log({ error });
          } else {
            console.log({ docs });
          }
        });
      }
    });
  } catch (e) {}
}
module.exports={
  createCheckin
}
