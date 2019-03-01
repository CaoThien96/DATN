const apiEmployee = require('../module/employee/api');
const apiRequest = require('../module/request/apiEmployee');
const apiNotification = require('../module/notification/api');
const apiConfiguration = require('../module/configuration/api');
module.exports = app => {
  app.use('/api/employee', apiEmployee);
  app.use('/api/request', apiRequest);
  app.use('/api/notification', apiNotification);
  app.use('/api/configuration', apiConfiguration);
  return app;
};
