const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    iid: {
      type: Number,
    },
    type: {
      type: String,
    },
    subjectIid: {
      type: Number,
    },
    u: {
      iid: Number,
      email: String,
      full_name: String,
    },
    content: String,
    reply: [],
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);
NotificationSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});

module.exports = mongoose.model('Comment', NotificationSchema);
