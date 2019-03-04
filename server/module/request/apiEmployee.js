const routes = require('express').Router();
const lodash = require('lodash');
const Request = require('./model');

routes.use('*', (req, res, next) => {
  // Check auth
  next();
});
routes.post('/comment', (req, res) => {
  const { comment, u, requestIid } = req.body;
  try {
    Request.findOne({ iid: requestIid }, (err, docs) => {
      if (err) {
        return res.status(500).send({
          success: false,
          err: 'khong tim thay binh luan',
        });
      }
      let comments = null;
      if (docs.comments) {
        const test = docs.comments.push({
          content:comment,
          u:{
            email:u.email,
            iid:u.iid
          }
        })
      } else {
        comments = [
          {
            content: comment,
            u,
          },
        ];
      }
      Request.update({iid:requestIid},{comments:docs.comments},(err2,data)=>{
        if(err){
          return res.status(500).send({
            success:false,
            err:err2
          })
        }
        res.status(200).send({
          success:true,
          payload:data
        })
      })
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      err: e,
    });
  }
});
/**
 * Truy van lay yeu cau
 */
routes.get('/', (req, res) => {
  Request.find({}, (err, data) => {
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
  newRequest.date = date;
  newRequest
    .save()
    .then(data => {
      res.status(200).send({
        success: true,
        payload: data,
      });
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
  const status = req.body.status ? 1 : 2;
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
