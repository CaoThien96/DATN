const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('../../configs/auto-increment');
const CheckIn = require('../checkin/model');
const CheckInDetail = require('../checkin/model/check_in_detail');
const { Schema } = mongoose;

const UserSchema = new Schema({
  iid: {
    type: Number,
  },
  email: {
    type: String,
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
  /**
   * Tao phien giam sat cho nhan vien moi tao
   */
  if(this.role === 1000){
    CheckIn.searchCheckIn(new Date(), (err, doc) => {
      console.log({ err, doc });
      if (err) {
        console.log(err);
      } else {
        const checkIn = doc[0];
        const newCheckInDetail = [
          {
            user,
            pid: checkIn.iid,
          },
        ];
        CheckInDetail.insertMany(newCheckInDetail, (error, docs) => {
          if (err) {
            return next(err);
          }
          console.log({ docs });
        });
      }
    });
    if (user && user.role === 1000) {
      user.status = 1;
    } else {
      user.status = 0;
    }
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
// UserSchema.pre('update', function(next) {
//   const modifiedField = this.getUpdate().$set.password;
//   if (!modifiedField) {
//     console.log('updated dasdasd');
//     return next();
//   }
//   // try {
//   //   const newFiedValue = // do whatever...
//   //     this.getUpdate().$set.field = newFieldValue;
//   //   next();
//   // } catch (error) {
//   //   return next(error);
//   // }
//   console.log('updated');
//   next();
// });
UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
UserSchema.methods.changePassword = function(oldePass, newPass, cb) {
  bcrypt.compare(oldePass, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    if (isMatch) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return cb(err);
        }
        bcrypt.hash(newPass, salt, null, (err, hash) => {
          if (err) {
            return cb(err);
          }
          this.model('User').updateOne(
            { iid: this.iid },
            { password: hash },
            (err, res) => {
              // Updated at most one doc, `res.modifiedCount` contains the number
              // of docs that MongoDB updated
              if (err) {
                return cb(err);
              }
              return cb(null, res);
            },
          );
        });
      });
    } else {
      return cb('Mật khẩu không đúng');
    }
  });
};
module.exports = mongoose.model('User', UserSchema);
