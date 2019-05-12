const mongoose = require('mongoose');
const Request = require('../../request/model');
const { Schema } = mongoose;
const Configuration = require('../../configuration/model');
const CheckInDetailSchema = new Schema(
  {
    pid: Number,
    user: {
      type: Schema.Types.Mixed,
    },
    time: {
      type: Schema.Types.Mixed,
    },
    /**
     * 1 la dung gio
     * 2 la di muon
     * 3 la xin nghi
     * 0 la nghi
     */
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);
// CheckInDetailSchema.plugin(autoIncrement.plugin, {
//   model: 'CheckInDetailSchema',
//   field: 'iid',
//   startAt: 1000,
//   incrementBy: 1,
// });

CheckInDetailSchema.methods.updateStatus = async function(cb) {
  Configuration.find(
    { $or: [{ name: 'on_time' }, { name: 'late_time' }] },
    async (err, docs) => {
      if (err) {
        return cb(err);
      }

      const late_time = docs.find(el => {
        if (el.name == 'late_time') return true;
      });
      const current_time = new Date().toTimeString();
      const late = new Date(late_time.value*1000).toTimeString()
      let status = 1;
      if (current_time > late) {
        status = 2;
      }
      const request = await Request.findRequestByUserMatchTime(this.user);
      if(request){
        status = 3;
      }
      console.log({ status });
      console.log({ current_time});



      this.model('CheckInDetail').updateOne(
        { pid: this.pid, 'user.iid': this.user.iid },
        { status },
        (err, res) => {
          // Updated at most one doc, `res.modifiedCount` contains the number
          // of docs that MongoDB updated
          if (err) {
            return cb(err);
          }
          cb(null, res);
        },
      );
    },
  );
};
CheckInDetailSchema.statics.findCheckInSuccess = function(checkIn, cb) {
  this.model('CheckInDetail').find(
    { pid: checkIn.iid, status: { $ne: 0 } },
    (err, docs) => {
      if (err) return cb(err);
      return cb(null, docs);
    },
  );
};
CheckInDetailSchema.statics.findCheckInDetailAll = function(checkIn, cb) {
  this.model('CheckInDetail').find({ pid: checkIn.iid }, (err, docs) => {
    if (err) return cb(err);
    return cb(null, docs);
  });
};
module.exports = mongoose.model('CheckInDetail', CheckInDetailSchema);
