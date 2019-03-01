const routes = require('express').Router();
const lodash = require('lodash');
const Notification = require('./model');

routes.use('*', (req, res, next) => {
  // Check auth
  next();
});

routes.get('/', (req, res) => {
  Notification.find({}, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    return res.status(200).send({
      success: true,
      payload: docs,
    });
  });
});
routes.get('/:id',(req,res)=>{
  Notification.findOne({iid:req.params.id}, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    return res.status(200).send({
      success: true,
      payload: docs,
    });
  });
})
routes.post('/', (req, res) => {
  const newNotification = new Notification();
  const { title, descriptions } = req.body;
  if (title) {
    newNotification.title = title;
  }
  if (descriptions) {
    newNotification.descriptions = descriptions;
  }
  newNotification
    .save()
    .then(docs => {
      res.status(200).send({
        success: true,
        payload: docs,
      });
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        err,
      });
    });
});
routes.put('/:id', (req, res) => {
  Notification.find({}, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    return res.status(200).send({
      success: true,
      payload: docs,
    });
  });
});
routes.delete('/:id', (req, res) => {
  Notification.find({}, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    return res.status(200).send({
      success: true,
      payload: docs,
    });
  });
});
module.exports = routes;
