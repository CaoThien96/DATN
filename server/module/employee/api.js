const routes = require('express').Router();
const lodash = require('lodash');
const User = require('./model');
routes.get('/', async (req, res) => {
  try {
    const body = req.body;
    let condition = {role:1000};
    if (!lodash.isEmpty(req.query)) {
      const query = JSON.parse(req.query.value);
      const status = query.status;
      const iid = parseInt(query.iid);
      const email = query.email;
      if (iid) {
        condition = { ...condition, iid };
      }
      if (email) {
        condition = { ...condition, email: { $regex: email, $options: 'i' } };
      }
      if (status.length) {
        let or = [];
        for (let i = 0; i < status.length; i++) {
          or = [...or, { status: status[i] }];
        }
        condition = { ...condition, $or: or };
      }
    }

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
    const user = await User.findOne({ iid: id,role:1000 });
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
routes.put('/:id', async (req, res) => {
  // res.status(200).send('oke');
  const iid = parseInt(req.params.id);
  const status = req.body.status ? 1 : 2;
  User.update({ iid }, { status }, (err, docs) => {
    console.log(err);
    res.send({
      success: true,
      payload: docs,
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
      error:e
    });
  }
});
routes.post('/', async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  try {
    const user = await newUser.save();
    console.log({ user });
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
module.exports = routes;
