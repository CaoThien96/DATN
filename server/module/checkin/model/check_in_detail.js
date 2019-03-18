const mongoose = require('mongoose');
const { Schema } = mongoose;

const CheckInDetailSchema = new Schema(
  {
    pid: Number,
    user: {
      type: Schema.Types.Mixed,
    },
    time: {
      type: Date,
    },
    /**
     * 1 la dung gio
     * 2 la di muon
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

module.exports = mongoose.model('CheckInDetail', CheckInDetailSchema);
