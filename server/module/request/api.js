const routes = require('express').Router();
const lodash = require('lodash');
const Request = require('./model');
const News = require('../news/model')
routes.use('*', (req, res, next) => {
  // Check auth
  next();
});
/**
 * Truy van lay yeu cau
 */
routes.get('/', (req, res) => {
  let condition = {};
  if (!lodash.isEmpty(req.query)) {
    const query = JSON.parse(req.query.value);
    const status = query.status;
    const iid = parseInt(query.iid);
    if (iid) {
      condition = { ...condition, iid };
    }

    if (status.length) {
      let or = [];
      for (let i = 0; i < status.length; i++) {
        or = [...or, { status: status[i] }];
      }
      condition = { ...condition, $or: or };
    }
  }
  Request.find(condition, (err, data) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    res.status(200).send({
      success: true,
      payload: data,
    });
  });
});
/**
 * Lay chi tiet mot yeu cau
 */
routes.get('/:id', (req, res) => {
  const iid = req.params.id;
  const u = req.user;
  Request.findOne({ iid }, (err, data) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    res.status(200).send({
      success: true,
      payload: data,
    });
  });
});
routes.get('/search/:key', (req, res) => {
  const iid = req.params.id;
  Request.findOne({ iid }, (err, data) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    res.status(200).send({
      success: true,
      payload: data,
    });
  });
});
/**
 * Tao yeu cau
 */
routes.post('/', (req, res) => {
  const { title, descriptions, userIid, date } = req.body;
  const newRequest = new Request();
  newRequest.title = title;
  newRequest.descriptions = descriptions;
  newRequest.userIid = 1001;
  newRequest.addition = {
    date,
  };
  newRequest.u = req.user;
  if (req.files) {
    newRequest.files = Object.values(req.files)[0];
    // const listImage= await Promise.all(saveImage);
    // console.log(listImage)
  }
  newRequest
    .save()
    .then(docs => {
      News.createNewsForAdmin(
        `Có yêu cầu mới mới:${title}`,
        `/admin/request/${docs.iid}`,
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
    .catch(e =>
      res.status(500).send({
        success: false,
        err: e,
      }),
    );
});
/**
 * Tao yeu cau
 */
routes.put('/:id', (req, res) => {
  const iid = parseInt(req.params.id);
  const status = req.body.status;
  Request.update({ iid }, { status }, (err, docs) => {
    res.send({
      success: true,
      payload: docs,
    });
  });
});
/**
 * Xoa yeu cau
 */
routes.delete('/', (req, res) => {});
module.exports = routes;
