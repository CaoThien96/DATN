const routes = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../employee/model');
const config = require('../../configs/index');
routes.post('/sign-in', (req, res, next) =>
  passport.authenticate('local-sign-in', { session: false }, (err, token) => {
    if (err) {
      return res.status(200).send({
        success: false,
        err: (err.message),
      });
    }
    return res.status(200).send({
      success: true,
      token,
      message: 'user found & logged in',
    });
  })(req, res, next),
);
routes.get('/api/get-current-user', (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      success:false,
      error:'Chua dang nhap'
    }).end();
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization;
  // decode the token using a secret key-phrase
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).end();
    }
    const userId = decoded.sub;
    // check if a user exists
    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }
      // pass user details onto next route
      res.send(user);
    });
  });
});
module.exports = routes;
