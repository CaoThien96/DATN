const apiEmployee = require('../module/employee/api');
module.exports = app => {
  app.use('/api/employee', apiEmployee);
  return app;
};
