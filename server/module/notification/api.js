const routes = require('express').Router();
const lodash = require('lodash');
const Notification = require('./model');

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
/**
 * Add comment to notification
 */
routes.post('/:id/comment', async (req, res) => {
  const iid = req.params.id;
  const body = req.body;
  if (body.type == 'reply') {
    Notification.update(
      { iid },
      { comments: body.notificationDetail.comments },
      async (err, docs) => {
        if (err) {
          return res.status(500).send(err);
        }
        const notification = await Notification.findOne({ iid });
        console.log(notification);
        return res.send({
          payload: notification,
        });
      },
    );
  }else{
    try {
      let notification = await Notification.findOne({ iid });
      const comments = notification.comments;
      comments.push({
        u: req.user,
        content: body.content,
        time: new Date(),
      });
      // console.log(comments);
      Notification.update({ iid }, { comments }, async (err, docs) => {
        if (err) {
          return res.status(500).send(err);
        }
        notification = await Notification.findOne({ iid });
        return res.send({
          payload: notification,
        });
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }

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
