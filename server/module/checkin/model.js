const mongoose = require('mongoose');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const CheckInSchema = new Schema(
  {
    iid: {
      type: Number,
    },
    date: {
      type: Date,
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

module.exports = mongoose.model('CheckIn', CheckInSchema);
