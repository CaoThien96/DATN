const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  iid: {
    type: Number,
  },
  title: {
    type: String,
  },
  descriptions: {
    type: String,
  },
  comments: [
    {
      content: String,
      u: {
        email: String,
        iid: Number,
      },
      reply:[]
    },
  ],
  status: {
    type: Number,
    default: 1,
  },
},{ timestamps: { createdAt: 'created_at' } });
NotificationSchema.plugin(autoIncrement.plugin, {
  model: 'Notification',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});

module.exports = mongoose.model('Notification', NotificationSchema);
