const CronJob = require('cron').CronJob;
const moment = require('moment');
const User = require('../module/employee/model');
const Configuration = require('../module/configuration/model');
const CheckIn = require('../module/checkin/model');
const CheckInDetail = require('../module/checkin/model/check_in_detail');
const JobExcuse = require('./JobExcuse')
async function createJobUpdateModel() {
  return new Promise(resolve => {
    Configuration.findOne({ name: 'time_update_model' }, (err, doc) => {
      const time = moment.unix(doc.value);
      const configJob = `0 ${time.minute()} ${time.hour()} * * 0-6`.toString();
      const job = new CronJob(configJob, async () => {
        console.log(`time_update_model${new Date().toDateString()}`);
        JobExcuse.saveAndUpdateModel();
      });
      resolve(job);
    });
  });
}
/**
 * Job tao cac ket qua giam sat cho tat ca cac nhan vien mac dinh status la nghi
 * Khi nao check in thi se cap nhat lai status
 * @returns {Promise<*>}
 */
async function createJobCheckIn() {
  return new Promise(resolve => {
    Configuration.findOne({ name: 'time_create_checkin' }, (err, doc) => {
      const time = moment.unix(doc.value);
      const configJob = `0 ${time.minute()} ${time.hour()} * * 0-6`.toString();
      const job = new CronJob(configJob, async () => {
        console.log(`createJobCheckIn${new Date().toDateString()}`);
        JobExcuse.createCheckin();
      });
      resolve(job);
    });
  });
}
module.exports = {
  createJobCheckIn,
  createJobUpdateModel,
};
