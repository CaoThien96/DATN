const routes = require('express').Router();
const lodash = require('lodash');
const CheckIn = require('./model');
const CheckInDetail = require('./model/check_in_detail');
const compareYMD = (date1, date2) => {};
routes.post('/', async (req, res) => {
  const checkInDetail = await CheckInDetail.find({
    'user.iid': 1011,
  });
  const tmpCheckIn = lodash.find(checkInDetail, el => {
    const createAt = el.created_at;
    const todayDate = new Date();
    const date1 = {
      y: todayDate.getFullYear(),
      m: todayDate.getMonth(),
      d: todayDate.getDate(),
    };
    const date2 = {
      y: createAt.getFullYear(),
      m: createAt.getMonth(),
      d: createAt.getDate(),
    };
    if (JSON.stringify(date1) === JSON.stringify(date2)) {
      return true;
    }
    return false;
  });
  console.log({ tmpCheckIn });
});
routes.put('/', async (req, res) => {
  const { userIid, statusCheckIn } = req.body;

  CheckIn.searchCheckIn(new Date(), (err, doc) => {
    console.log({ err, doc });
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const checkIn = doc[0];
      CheckInDetail.findOne(
        { pid: checkIn.iid, 'user.iid': parseInt(userIid) },
        (err, check_in_detail) => {
          if (check_in_detail.status === 0) {
            check_in_detail.updateStatus((err, response) => {
              CheckInDetail.findCheckInSuccess(
                checkIn,
                (err, listCheckSuccess) => {
                  console.log({ listCheckSuccess });
                  res.send({
                    success: true,
                    listCheckSuccess,
                  });
                  // console.log(res)

                  // socket.emit('action', {
                  //   type: 'boilerplate/Check/OnUpdateListCheckIn',
                  //   payload: listCheckSuccess,
                  // });
                },
              );
            });
          } else {
            CheckInDetail.findCheckInSuccess(
              checkIn,
              (err, listCheckSuccess) => {
                console.log({ listCheckSuccess });
                // console.log(res)
                res.send({
                  success: true,
                  listCheckSuccess,
                });
                // socket.emit('action', {
                //   type: 'boilerplate/Check/OnUpdateListCheckIn',
                //   payload: listCheckSuccess,
                // });
              },
            );
          }
        },
      );
    }
  });

  // const checkInDetail = await CheckInDetail.find({
  //   'user.iid': userIid,
  // });
  // const tmpCheckIn = lodash.find(checkInDetail, el => {
  //   const createAt = el.created_at;
  //   const todayDate = new Date();
  //   const date1 = {
  //     y: todayDate.getFullYear(),
  //     m: todayDate.getMonth(),
  //     d: todayDate.getDate(),
  //   };
  //   const date2 = {
  //     y: createAt.getFullYear(),
  //     m: createAt.getMonth(),
  //     d: createAt.getDate(),
  //   };
  //   if (JSON.stringify(date1) === JSON.stringify(date2)) {
  //     return true;
  //   }
  //   return false;
  // });
  // const id = tmpCheckIn._id;
  // CheckInDetail.update(
  //   { _id: tmpCheckIn._id },
  //   { status: statusCheckIn },
  //   (err, data) => {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       res.status(200).send(data);
  //     }
  //   },
  // );
});
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
    if(err){
      return res.status(500).send({
        success:false,
        err:err
      })
    }
    const listPid = docs.map(el=>el.iid);
    console.log(listPid)
    CheckInDetail.find({pid:{$in:listPid},"user.iid":1019},(err,listCheckInDetail)=>{
      res.send({
        success:true,
        payload:listCheckInDetail
      })
    })
  });

});
module.exports = routes;
