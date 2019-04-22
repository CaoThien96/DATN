const routes = require('express').Router();
const lodash = require('lodash');
const Notification = require('./model');
const News = require('../news/model');
const commonPath = require('../../common/path');

routes.use('*', (req, res, next) => {
  // Check auth
  next();
});

routes.get('/', (req, res) => {
  let condition = {};
  if (!lodash.isEmpty(req.query)) {
    const query = JSON.parse(req.query.value);
    const status = query.status;
    const title = parseInt(query.title);
    if (title) {
      condition = { ...condition, email: { $regex: email, $options: 'i' } };
    }
    if (status.length) {
      let or = [];
      for (let i = 0; i < status.length; i++) {
        or = [...or, { status: status[i] }];
      }
      condition = { ...condition, $or: or };
    }
  }
  Notification.find(condition, (err, docs) => {
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
routes.get('/:id', (req, res) => {
  Notification.findOne({ iid: req.params.id }, (err, docs) => {
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
/**
 * Tao moi notification
 */
routes.post('/', async (req, res) => {
  const newNotification = new Notification();
  const { title, descriptions } = req.body;
  if (title) {
    newNotification.title = title;
  }
  if (descriptions) {
    newNotification.descriptions = descriptions;
  }
  if (req.files) {
    newNotification.files = Object.values(req.files)[0];
    // const listImage= await Promise.all(saveImage);
    // console.log(listImage)
  }
  newNotification
    .save()
    .then(docs => {
      News.createNewsForEmployee(
        `Có thông báo mới:${title}`,
        `/admin/notification/${docs.iid}`,
        (err, doc) => {
          if (err) {
            return res.send({
              success: false,
              err,
            });
          }
          req.app.io.emit('action', { type: 'boilerplate/Admin/Update_News' });
          return res.status(200).send({
            success: true,
            payload: 'Tạo thông báo thành công',
          });
        },
      );
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        err,
      });
    });
});
/**
 * Add comment to notification
 */

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
  const iid = req.params.id;
  Notification.updateOne({ iid }, { status: 0 }, (err, mes) => {
    if (err) {
      return res.send({
        success: false,
        err,
      });
    }
    return res.send({
      success: true,
      payload: mes,
    });
  });
});
module.exports = routes;
