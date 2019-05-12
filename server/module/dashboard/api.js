const routes = require('express').Router();
const controller = require('./controller');
routes.get('/get-warning/:start/:end', controller.handleGetWarningEmployee);

module.exports = routes;
