const CronJob = require('cron').CronJob;
const moment = require('moment');
const User = require('../module/employee/model');
const Configuration = require('../module/configuration/model');
const CheckIn = require('../module/checkin/model');
const Request = require('../module/request/model');
const CheckInDetail = require('../module/checkin/model/check_in_detail');
async function createCheckin() {
  try {
    const users = await User.find({ role: 1000, status: 1 });
    const newCheckIn = new CheckIn();
    newCheckIn.date = new Date();
    const y = new Date().getFullYear();
    const m = new Date().getMonth();
    const d = new Date().getDate();
    CheckIn.create(
      { date: new Date(y, m, d, 0, 5, 0).getTime() },
      async (err, candies) => {
        if (err) {
          console.log({ err });
        } else {
          let newCheckInDetail = [];
          for (let i = 0; i < users.length; i++) {
            const el = users[i];
            try {
              const request = await Request.findRequestByUserMatchTime(
                users[i],
              );

              if (request) {
                newCheckInDetail = [
                  ...newCheckInDetail,
                  {
                    user: el,
                    pid: candies.iid,
                    status: 3,
                  },
                ];
              } else {
                newCheckInDetail = [
                  ...newCheckInDetail,
                  {
                    user: el,
                    pid: candies.iid,
                  },
                ];
              }
            } catch (e) {
              newCheckInDetail = [
                ...newCheckInDetail,
                {
                  user: el,
                  pid: candies.iid,
                },
              ];
            }
          }
          CheckInDetail.insertMany(newCheckInDetail, (error, docs) => {
            if (err) {
              console.log({ error });
            } else {
              console.log({ docs });
            }
          });
        }
      },
    );
  } catch (e) {}
}
module.exports = {
  createCheckin,
};
