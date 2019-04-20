const mongoose = require('mongoose');
const fs = require('fs');
const autoIncrement = require('../../configs/auto-increment');
const commonPath = require('../../common/path');
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
    default: 1,
  },
  descriptions: {
    type: String,
  },
  images: [String],
  addition: {
    type: Schema.Types.Mixed,
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
  u: {
    type: Schema.Types.Mixed,
  },
  status: {
    type: Number,
    default: 0, // 0 la dang cho, 1 la chap nhan, 2 la khong chap nhan, 3 huy bo yeu cau
  },
});
RequestSchema.plugin(autoIncrement.plugin, {
  model: 'Request',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});
RequestSchema.pre('save', async function(next) {
  if (!this.files) {
    return next();
  }
  try {
    let files = this.files;
    if (!Array.isArray(files)) {
      files = [files];
    }
    const saveImage = files.map((el, key) => {
      const pathSave = commonPath.pathRequest(`${this.iid}/${key}.jpg`);
      const nameSave = `${this.iid}/${key}.jpg`;
      if (!fs.existsSync(commonPath.pathRequest(`${this.iid}`))) {
        fs.mkdirSync(commonPath.pathRequest(`${this.iid}`));
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
RequestSchema.methods.addComment = function(comments, cb) {
  RequestModel.updateOne({ iid: this.iid }, { comments }, (err, docs) => {
    // Updated at most one doc, `res.modifiedCount` contains the number
    // of docs that MongoDB updated
    if (err) {
      return cb(err);
    }
    cb(null, docs);
  });
};

const RequestModel = mongoose.model('Request', RequestSchema);
module.exports = RequestModel;
