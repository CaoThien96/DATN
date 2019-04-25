const routes = require('express').Router();
const lodash = require('lodash');
const User = require('./model');
const Controller = require('./controller')
const CheckIn = require('../checkin/model');
const CheckInDetail = require('../checkin/model/check_in_detail');
const mail = require('../../configs/mail');
const commonPath = require('../../common/path');
routes.get('/', async (req, res) => {
  try {
    const body = req.body;
    let condition = { role: 1000 };
    if (!lodash.isEmpty(req.query)) {
      const query = JSON.parse(req.query.value);
      const status = query.status;
      const iid = parseInt(query.iid);
      const email = query.email;
      const training = query.training;
      console.log(req.query);
      if (iid) {
        condition = { ...condition, iid };
      }
      if (email) {
        condition = { ...condition, email: { $regex: email, $options: 'i' } };
      }
      if (training) {
        condition = { ...condition, training: { $exists: true }, status: 1 };
      }
      if (status && status.length) {
        let or = [];
        for (let i = 0; i < status.length; i++) {
          or = [...or, { status: status[i] }];
        }
        condition = { ...condition, $or: or };
      }
    }
    console.log({ condition });
    const allUser = await User.find(condition);
    res.send(allUser);
  } catch (e) {
    res.status(500).send({
      success: false,
      err: e,
    });
  }
});
routes.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await User.findOne({ iid: id, role: 1000 });
    if (user !== null) {
      res.send({
        success: true,
        payload: user,
      });
    } else {
      res.send({
        success: false,
        message: 'Not found user',
      });
    }
  } catch (e) {
    res.staus(500).send({
      success: false,
    });
  }
});
/**
 * Get check in detail of employee
 */
routes.get('/:id/check-in-detail', async (req, res) => {
  const iid = parseInt(req.params.id);
  const user = await User.findOne({ iid });
  if (user === null) {
    return res.send({
      success: false,
      err: 'Không tìm thấy nhân viên',
    });
  }
  CheckIn.searchCheckIn(new Date(), (err, doc) => {
    console.log({ err, doc });
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      const checkIn = doc[0];
      CheckInDetail.findOne(
        { pid: checkIn.iid, 'user.iid': iid },
        (err, check_in_detail) => {
          if (err) {
            return res.send({
              success: false,
              err,
            });
          }
          if (check_in_detail === null) {
            return res.send({
              success: false,
              err: 'Khong tim thay phien giam giat',
            });
          }
          if (check_in_detail.status !== 0) {
            return res.send({
              success: false,
              err: 'Nhân viên đã điểm danh',
            });
          }
          return res.send({
            success: true,
            payload: {
              user,
              check_in_detail,
            },
          });
        },
      );
    }
  });
});
routes.put('/:id', async (req, res) => {
  try {
    const iid = parseInt(req.params.id);
    let update = {};
    if (req.body.status !== undefined) {
      const status = req.body.status ? 1 : 2;
      update = { ...update, status };
    }
    if (req.body.full_name) {
      const full_name = req.body.full_name;
      update = { ...update, full_name };
    }
    if (req.body.phone) {
      const phone = req.body.phone;
      update = { ...update, phone };
    }
    if (req.files) {
      const files = Object.values(req.files);
      const name = req.user.iid;
      const saveAvatar = new Promise((resolve, reject) => {
        const pathSave = commonPath.pathAvatar(`${name}.jpg`);
        files[0].mv(pathSave, (err, mes) => {
          if (err) {
            reject(err);
          } else {
            resolve(pathSave);
          }
        });
      });
      const pathSave = await saveAvatar;
      update = { ...update, avatar: `${name}.jpg` };
    }
    User.update({ iid }, update, (err, docs) => {
      if (err) {
        return res.send({ success: false, err });
      }
      return res.send({
        success: true,
        payload: docs,
      });
    });
  } catch (e) {
    res.send({
      success: false,
      err: e,
    });
  }
});
/**
 * Change password
 */
routes.put('/:id/change-password', (req, res) => {
  const iid = req.params.id;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  User.findOne({ iid }, (err, user) => {
    if (err)
      return res.send({
        success: false,
        err,
      });
    user.changePassword(password, newPassword, (err, mes) => {
      if (err)
        return res.send({
          success: false,
          err,
        });
      return res.send({ success: true, payload: mes });
    });
  });
});
routes.delete('/:id', async (req, res) => {
  // res.status(200).send('oke');
  const iid = parseInt(req.params.id);
  try {
    User.update({ iid }, { status: 0 }, (err, docs) => {
      res.send({
        success: true,
        payload: docs,
      });
    });
  } catch (e) {
    res.staus(500).send({
      success: false,
    });
  }
});
routes.put('/', async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { iid: req.body.id },
      { $set: { training: JSON.stringify(req.body.data) } },
    );
    res.send({
      success: true,
    });
  } catch (e) {
    res.staus(500).send({
      success: false,
      error: e,
    });
  }
});

routes.post('/', async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;
  const randomPass =
    Math.random()
      .toString(36)
      .substring(2, 5) +
    Math.random()
      .toString(36)
      .substring(2, 5);
  const newUser = new User();
  newUser.email = email;
  newUser.password = randomPass;
  newUser.full_name = full_name;
  newUser.phone = phone;
  newUser.role = role;
  // Check email
  const check = await User.findOne({ email, status: { $ne: 0 } });
  if (check) {
    return res.send({
      success: false,
      err: 'Email is exists',
    });
  }
  try {
    const user = await newUser.save();
    console.log({ user });
    /**
     * Send pass to mail
     */
    mail.sendOne(
      'caothienbk@gmail.com',
      'Register succession',
      `Your password is: ${randomPass}`,
      `<p>Your password is: ${randomPass}</p>`,
    );
    res.send({
      success: true,
      payload: user,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      err: e,
    });
  }
});
routes.post('/upload-image', (req, res) => {
  console.log(req.body);
  res.send({
    success: 'oke',
  });
});
routes.post('/save-data-training/:iid',Controller.handleSaveImageTrain);
module.exports = routes;
