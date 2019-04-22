const routes = require('express').Router();
const lodash = require('lodash');
const controller = require('./controller');
routes.get('/', controller.handleGetNews);
routes.get('/newsByUser/:iid', controller.handleGetNews);
routes.put('/updateStatus', controller.updateStatus);
routes.post('/', controller.handleCreateNews);
module.exports = routes;
