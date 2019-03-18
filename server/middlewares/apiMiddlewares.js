const authCheck = require('../configs/auth-check');
const apiEmployee = require('../module/employee/api');
const apiRequest = require('../module/request/apiEmployee');
const apiNotification = require('../module/notification/api');
const apiConfiguration = require('../module/configuration/api');
const apiAuth = require('../module/auth/api');
const apiCheckIn = require('../module/checkin/api');
const ai = require('../module/ai/api');
module.exports = app => {
  app.use('/', apiAuth);
  app.use('/ai', ai);
  app.use('/api', authCheck);
  app.use('/api/employee', apiEmployee);
  app.use('/api/request', apiRequest);
  app.use('/api/notification', apiNotification);
  app.use('/api/configuration', apiConfiguration);
  app.use('/api/check-in', apiCheckIn);
  return app;
};
