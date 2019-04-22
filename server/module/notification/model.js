const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const commonPath = require('../../common/path');
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
    images: [String],
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
NotificationSchema.pre('save', async function(next) {
  if (!this.files) {
    return next();
  }
  try {
    let files = this.files;
    if (!Array.isArray(files)) {
      files = [files];
    }
    const saveImage = files.map((el, key) => {
      const pathSave = commonPath.pathNotification(`${this.iid}/${key}.jpg`);
      const nameSave = `${this.iid}/${key}.jpg`;
      if (!fs.existsSync(commonPath.pathNotification(`${this.iid}`))) {
        fs.mkdirSync(commonPath.pathNotification(`${this.iid}`));
      }

      return new Promise((resolve, reject) => {
        el.mv(pathSave, (err, mes) => {
          if (err) {
            reject(err);
          } else {
            resolve(nameSave);
          }
        });
      });
    });
    const listName = await Promise.all(saveImage);
    this.images = listName;
    return next();
  } catch (e) {
    return next(e);
  }
});
NotificationSchema.methods.addComment = function(comments, cb) {
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
