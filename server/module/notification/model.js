const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
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
        reply: [],
        time: {
          type: Date,
        },
      },
    ],
    status: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);
NotificationSchema.plugin(autoIncrement.plugin, {
  model: 'Notification',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});
NotificationSchema.methods.addComment = function(comments,cb) {
  this.model('Notification').updateOne(
    { iid: this.iid },
    { comments },
    (err, docs) => {
      // Updated at most one doc, `res.modifiedCount` contains the number
      // of docs that MongoDB updated
      if (err) {
        return cb(err);
      }
      cb(null, docs);
    },
  );
};
module.exports = mongoose.model('Notification', NotificationSchema);
