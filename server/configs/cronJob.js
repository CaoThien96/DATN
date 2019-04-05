const CronJob = require('cron').CronJob;
const moment = require('moment')
const User = require('../module/employee/model');
const Configuration = require('../module/configuration/model');
const CheckIn = require('../module/checkin/model');
const CheckInDetail = require('../module/checkin/model/check_in_detail');
/**
 * Job tu dong tao log giam sat vao luc 0h0p0s hang ngay
 */
function createJobCheckin() {
  return new Promise(resolve => {
    Configuration.find(
      { $or: [{ name: 'on_time' }, { name: 'maxMiss' }] },
      (err, docs) => {
        const onTime = docs.find(el => {
          if (el.name == 'on_time') {
            return true;
          }
        });
        const maxMiss = docs.find(el => {
          if (el.name == 'maxMiss') {
            return true;
          }
        });
        console.log(onTime)
        const time = moment.unix(onTime.value);
        console.log(time.hour());
        console.log(time.minute());
        const configJob = `0 ${time.minute()} ${time.hour()} * * 0-4`.toString();
        const job = new CronJob(configJob, async () => {
          console.log(new Date())
        });
        resolve(job)
      },
    );
  })

}
// createJobCheckin();
const job = new CronJob('0 0 7 * * 0-4', async () => {
  try {
    const users = await User.find({ role: 1000, status: 1 });
    const newCheckIn = new CheckIn();
    newCheckIn.date = new Date();
    CheckIn.create({ date: new Date() }, (err, candies) => {
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
});

const job2 = new CronJob('0 35 00 * * 0-5', () => {
  const d = new Date();
  console.log('Second:', new  Date().toDateString());
});



// job.start();
job2.start();
