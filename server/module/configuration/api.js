const routes = require('express').Router();
const lodash = require('lodash');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const Configuration = require('./model');
const JobExcuse = require('../../configs/JobExcuse')
routes.get('/:name', (req, res) => {
  const name = req.params.name;
  try {
    Configuration.findOne({ name }, (err, docs) => {
      if (err) {
        return res.send({
          success: false,
          err,
        });
      }
      return res.send({
        success: true,
        payload: docs,
      });
    });
  } catch (e) {
    if (err) {
      return res.send({
        success: false,
        err: e,
      });
    }
  }
});

routes.post('/', (req, res) => {
  const { name, value } = req.body;
  if (name == 'time_create_checkin') {
    const index = req.app.jobs.findIndex(j => {
      if (j.name == 'createJobCheckIn') {
        return true;
      }
    });

    if (index > -1) {
      req.app.jobs[index].job.stop();
      req.app.jobs.splice(index, 1);
      const time = moment.unix(value);
      const configJob = `0 ${time.minute()} ${time.hour()} * * 0-6`.toString();
      const job = new CronJob(configJob, async () => {
        console.log(`time_create_checkin${new Date().toDateString()}`);
        JobExcuse.createCheckin();
      });
      job.start();
      req.app.jobs.push({
        name: 'createJobCheckIn',
        job,
      });
    }
  }
  if (name == 'time_update_model') {
    const index = req.app.jobs.findIndex(j => {
      if (j.name == 'createJobUpdateModel') {
        return true;
      }
    });
    if (index > -1) {
      req.app.jobs[index].job.stop();
      req.app.jobs.splice(index, 1);
      const time = moment.unix(value);
      const configJob = `0 ${time.minute()} ${time.hour()} * * 0-6`.toString();
      const job = new CronJob(configJob, async () => {
        JobExcuse.saveAndUpdateModel();
      });
      job.start();
      req.app.jobs.push({
        name: 'createJobUpdateModel',
        job,
      });
    }
  }
  Configuration.update({ name }, { value }, { upsert: true }, (err, docs) => {
    if (err) {
      return res.send({
        success: false,
        err,
      });
    }
    return res.send({
      success: true,
      payload: docs,
    });
  });
});

module.exports = routes;
