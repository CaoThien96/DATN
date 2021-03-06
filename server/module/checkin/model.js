const mongoose = require('mongoose');
const moment = require('moment');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const CheckInSchema = new Schema(
  {
    iid: {
      type: Number,
    },
    date: {
      type: Number,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);
CheckInSchema.plugin(autoIncrement.plugin, {
  model: 'CheckIn',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});
CheckInSchema.statics.searchCheckIn = function search(date = new Date(), cb) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  console.log({ y, m, d });
  const startTime = moment()
    .year(y)
    .month(m)
    .date(d)
    .hour(0)
    .minute(0)
    .second(0)
    .valueOf();
  const endTime = moment()
    .year(y)
    .month(m)
    .date(d)
    .hour(23)
    .minute(0)
    .second(0)
    .valueOf();
  return this.where('date')
    .gte(startTime)
    .lte(endTime)
    .exec(cb);
};
CheckInSchema.statics.searchCheckInByMonth = function search(
  date = new Date(),
  cb,
) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  console.log({ firstDay, lastDay });
  console.log({ x: firstDay.getTime(), y: lastDay.getTime() });
  return this.where('date')
    .gte(firstDay.getTime())
    .lte(lastDay.getTime())
    .exec(cb);
};
CheckInSchema.statics.searchCheckInByRange = function search(start, end, cb) {
  console.log({ start, end });
  return this.where('date')
    .gte(start)
    .lte(end)
    .exec(cb);
};
CheckInSchema.statics.searchCheckInDetailByRangeWithUser = function(
  start,
  end,
  user,
  cb,
) {
  this.searchCheckInByRange(start, end, (err, docs) => {
    if (err) {
      return cb(err);
    }
    if (docs === null) {
      return cb('Khong tim thay phien giam sat');
    }
    const listPid = docs.map(el => el.iid);
    console.log(listPid);
    this.aggregate([
      {
        $match: {
          iid: { $in: listPid },
        },
      },
      {
        $lookup: {
          from: 'checkindetails',
          let: { checkInIid: '$iid' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$pid', '$$checkInIid'] },
                    { $eq: ['$user.iid', user.iid] },
                  ],
                },
              },
            },
          ],
          as: 'check_in_detail',
        },
      },
      { $unwind: '$check_in_detail' }
    ]).exec((err, listCheckIn) => {
      if (err) {
        return cb(err);
      }
      return cb(null,listCheckIn);
    });
  });
};
module.exports = mongoose.model('CheckIn', CheckInSchema);
