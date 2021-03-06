const authCheck = require('../configs/auth-check');
const apiEmployee = require('../module/employee/api');
const apiRequest = require('../module/request/api');
const apiNotification = require('../module/notification/api');
const apiConfiguration = require('../module/configuration/api');
const apiAuth = require('../module/auth/api');
const apiCheckIn = require('../module/checkin/api');
const ai = require('../module/ai/api');
const apiNews = require('../module/news/api');
const apiDashboard = require('../module/dashboard/api');
module.exports = app => {
  app.use('/', apiAuth);
  app.use('/api/ai', ai);
  app.use('/api', authCheck);
  app.use('/api/employee', apiEmployee);
  app.use('/api/dashboard', apiDashboard);
  app.use('/api/news', apiNews);
  app.use('/api/request', apiRequest);
  app.use('/api/notification', apiNotification);
  app.use('/api/configuration', apiConfiguration);
  app.use('/api/check-in', apiCheckIn);
  return app;
};
