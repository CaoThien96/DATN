const routes = require('express').Router();
const User = require('./model');
routes.get('/', (req, res) => {
  res.send('oke2');
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
