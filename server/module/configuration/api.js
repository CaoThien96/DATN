const routes = require('express').Router();
const lodash = require('lodash');
const Configuration = require('./model');

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
