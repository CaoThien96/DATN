const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const RequestSchema = new Schema({
  iid: {
    type: Number,
  },
  title: {
    type: String,
  },
  userIid: {},
  /**
   * Type 1 Don xin nghi viec
   */
  type: {
    type: Number,
    default:1
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
    },
  ],
  u:{
    type:Schema.Types.Mixed
  },
  status: {
    type: Number,
    default: 0,//0 la dang cho, 1 la chap nhan, 2 la khong chap nhan, 3 huy bo yeu cau
  },
});
RequestSchema.plugin(autoIncrement.plugin, {
  model: 'Request',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});

module.exports = mongoose.model('Request', RequestSchema);
