const mongoose = require('mongoose');

const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    title: {
      type: String,
    },
    action: String,
    receiver: {
      type: Schema.Types.Mixed,
      // example: receiver: admin nguoi nhan la admin
      // receiver type: employee, u: User
    },
    status: {
      type: Number,
      default: 0, // 0 la chua doc, 1 la doc roi
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);
NewsSchema.statics.createNewsForAdmin = async function(
  title,
  action = false,
  cb,
) {
  const u = await this.model('User').findOne({
    email: 'admin@gmail.com',
    role: 1001,
  });

  this.create({ title, action, receiver: { type: 'admin', u } }, (err, doc) => {
    if (err) {
      return cb(err, null);
    }
    return cb(null, doc);
  });
};
NewsSchema.statics.createNewsForEmployee = async function(
  title,
  action = false,
  cb,
) {
  try {
    const users = await this.model('User').find({
      role: 1000,
      status: 1,
    });
    if (users.length) {
      const listNews = users.map(u => ({
        title,
        action,
        receiver: {
          type: 'employee',
          u,
        },
      }));
      const mes = await this.insertMany(listNews);
      cb(null, mes);
    }
  } catch (e) {
    cb(e);
  }
};
NewsSchema.statics.updateStatus = function(iid, cb) {
  const id = mongoose.Types.ObjectId(iid.toString());
  // var id2 = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
  this.updateOne({ _id: id }, { status: 1 }, (err, mes) => {
    if (err) {
      return cb(err);
    }
    return cb(null, mes);
  });
};
module.exports = mongoose.model('News', NewsSchema);
