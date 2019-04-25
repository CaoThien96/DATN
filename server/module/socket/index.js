const User = require('../employee/model');
const Notification = require('../notification/model');
const Request = require('../request/model');
const CheckIn = require('../checkin/model');
const CheckInDetail = require('../checkin/model/check_in_detail');
/**
 * Xu ly cap nhat trang thai check in cho user predicted
 * @param socket
 * @param action
 */
module.exports.handleUpdateStatusCheckIn = (socket, action) => {
  try {
    const userPredict = action.payload;
    CheckIn.searchCheckIn(new Date(), (err, doc) => {
      // console.log({ err, doc });
      if (err) {
        console.log(err);
      } else {
        const checkIn = doc[0];
        CheckInDetail.findOne(
          { pid: checkIn.iid, 'user.iid': parseInt(userPredict.iid) },
          (err, check_in_detail) => {
            if (check_in_detail.status === 0) {
              check_in_detail.updateStatus((err, res) => {
                CheckInDetail.findCheckInSuccess(
                  checkIn,
                  (err, listCheckSuccess) => {
                    console.log({ listCheckSuccess });
                    socket.emit('action', {
                      type: 'boilerplate/Check/OnUpdateListCheckIn',
                      payload: listCheckSuccess,
                    });
                  },
                );
              });
            } else {
              console.log('bo qua doi tuong da duoc check_in_detail');
              CheckInDetail.findCheckInSuccess(
                checkIn,
                (err, listCheckSuccess) => {
                  console.log({ listCheckSuccess });
                  socket.emit('action', {
                    type: 'boilerplate/Check/OnUpdateListCheckIn',
                    payload: listCheckSuccess,
                  });
                },
              );
            }
          },
        );
      }
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports.handleAddCommentRequest = async (io, socket, action) =>
  new Promise(async (resolve, reject) => {
    try {
      const payload = action.payload;
      const request = await Request.findOne({ iid: payload.objectDetail.iid });
      request.addComment(payload.comments, async (err, docs) => {
        console.log({ err, docs });
        const tmp = await Request.findOne({ iid: payload.objectDetail.iid });
        io.emit('action', {
          type: 'boilerplate/Request/Update_Request_Detail',
          payload: tmp,
        });
        resolve(err, docs);
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
module.exports.handleAddCommentNotification = async (io, socket, action) =>
  new Promise(async (resolve, reject) => {
    try {
      const payload = action.payload;
      const notification = await Notification.findOne({
        iid: payload.objectDetail.iid,
      });
      notification.addComment(payload.comments, async (err, docs) => {
        console.log({ err, docs });
        const tmp = await Notification.findOne({
          iid: payload.objectDetail.iid,
        });
        io.emit('action', {
          type: 'boilerplate/Notification/UpdateNotificationDetail',
          payload: tmp,
        });
        resolve(err, docs);
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
