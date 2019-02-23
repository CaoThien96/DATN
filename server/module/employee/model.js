const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');

const { Schema } = mongoose;

const UserSchema = new Schema({
  iid: {
    type: Number,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,
  },
  role: {
    type: Number,
    default: 1000,
  },
  status: {
    type: Number,
  },
  training: {
    type: String,
  },
});
UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'iid',
  startAt: 1000,
  incrementBy: 1,
});
UserSchema.pre('save', function(next) {
  const user = this;
  if (user && user.role === 1000) {
    user.status = 1;
  } else {
    user.status = 0;
  }
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
