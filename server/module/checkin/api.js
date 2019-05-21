const routes = require('express').Router();
const mongoose = require('mongoose');
const lodash = require('lodash');
const CheckIn = require('./model');
const User = require('../employee/model');
const CheckInDetail = require('./model/check_in_detail');

routes.get('/list-check-in-success', (req, res) => {
  console.log(req.app.socket.id);
  CheckIn.searchCheckIn(new Date(), (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else if (docs.length) {
      const checkIn = docs[0];
      CheckInDetail.findCheckInSuccess(checkIn, (err, listCheckSuccess) => {
        console.log({ listCheckSuccess });
        // console.log(res)
        req.app.socket.emit('action', {
          type: 'boilerplate/Check/OnUpdateListCheckIn',
          payload: listCheckSuccess,
        });
        res.send({
          success: true,
          listCheckSuccess,
        });
      });
    } else {
      req.app.socket.emit('action', {
        type: 'boilerplate/Check/OnUpdateListCheckIn',
        payload: [],
      });
      res.send({
        success: true,
        listCheckSuccess: [],
      });
    }
  });
});
routes.get('/list-check-in-by-date', (req, res) => {
  console.log(req.query.date);

  const time = new Date(JSON.parse(req.query.date).time);
  console.log(time);
  console.log(time.getDate());
  CheckIn.searchCheckIn(time, (err, docs) => {
    if (docs.length) {
      const checkIn = docs[0];
      CheckInDetail.findCheckInDetailAll(checkIn, (err, listCheckSuccess) => {
        res.status(200).send({
          success: true,
          payload: listCheckSuccess,
        });
      });
    } else {
      res.status(200).send({
        success: true,
        payload: [],
      });
    }
  });
});
routes.get('/list-check-in-by-month-with-user', (req, res) => {
  CheckIn.searchCheckInByMonth(new Date(), (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    const listPid = docs.map(el => el.iid);
    console.log(listPid);
    CheckInDetail.find(
      { pid: { $in: listPid }, 'user.iid': req.user.iid },
      (err, listCheckInDetail) => {
        res.send({
          success: true,
          payload: listCheckInDetail,
        });
      },
    );
  });
});
routes.get('/list-check-in-by-range-with-admin/:start/:end', (req, res) => {
  const { start, end } = req.params;
  console.log({ start, end });
  CheckIn.searchCheckInByRange(start, end, (err, docs) => {
    if (err) {
      return res.status(500).send({
        success: false,
        err,
      });
    }
    if (docs === null) {
      return res.status(500).send({
        success: false,
        err: 'Khong tim thay phien checkin nao',
      });
    }
    const listPid = docs.map(el => el.iid);
    console.log(listPid);

    CheckIn.aggregate([
      {
        $match: {
          iid: { $in: listPid },
        },
      },
      {
        $lookup: {
          from: 'checkindetails',
          localField: 'iid',
          foreignField: 'pid',
          as: 'check_in',
        },
      },
    ]).exec((err, listCheckIn) => {
      res.send({
        success: true,
        payload: listCheckIn,
        err,
      });
    });
    // CheckInDetail.find({ pid: { $in: listPid } }, (err, listCheckInDetail) => {
    //   res.send({
    //     success: true,
    //     payload: listCheckInDetail,
    //   });
    // });
  });
});
routes.get(
  '/list-check-in-by-range-with-employee/:start/:end/:iid',
  async (req, res) => {
    const { start, end, iid } = req.params;
    const user = await User.findOne({ iid: parseInt(iid) });
    CheckIn.searchCheckInDetailByRangeWithUser(
      start,
      end,
      user,
      (err, listCheckIn) => {
        if (err) {
          return res.send({
            success: false,
            err,
          });
        }
        return res.send({
          success: true,
          payload: listCheckIn,
        });
      },
    );
  },
);

routes.put('/', async (req, res) => {
  const { userIid, statusCheckIn, idCheckInDetail } = req.body;
  const checkInDetail = await CheckInDetail.find({
    'user.iid': userIid,
  });

  // const id = tmpCheckIn._id;
  const id = mongoose.Types.ObjectId(idCheckInDetail.toString());
  const check_in_detail = await CheckInDetail.findOne({ _id: id });
  if (check_in_detail) {
    check_in_detail.updateStatus((err, mes) => {
      if (mes) {
        CheckInDetail.findCheckInSuccess(
          { iid: check_in_detail.pid },
          (err, listCheckSuccess) =>
            res.status(200).send({
              success: true,
              listCheckSuccess,
            }),
        );
      }else {
        return res.status(500).send(err);
      }
    });
  } else {
    return res.status(500).send('Khong tim thay check in detail');
  }
});
module.exports = routes;
