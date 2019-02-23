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
  type: {
    type: Number,
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
  status: {
    type: Number,
    default: 0,
  },
});
RequestSchema.plugin(autoIncrement.plugin, {
  model: 'Request',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});

module.exports = mongoose.model('Request', RequestSchema);
