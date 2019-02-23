const apiEmployee = require('../module/employee/api');
const apiRequest = require('../module/request/apiEmployee');
module.exports = app => {
  app.use('/api/employee', apiEmployee);
  app.use('/api/request', apiRequest);
  return app;
};
