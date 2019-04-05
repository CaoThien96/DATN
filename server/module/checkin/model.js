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
      type: Schema.Types.Mixed,
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
module.exports = mongoose.model('CheckIn', CheckInSchema);
