const routes = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const User = require('../employee/model');
const config = require('../../configs/index');
routes.post('/sign-in', (req, res, next) =>
  passport.authenticate('local-sign-in', { session: false }, (err, token) => {
    if (err) {
      return res.status(200).send({
        success: false,
        err: err.message,
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
    return res
      .status(401)
      .send({
        success: false,
        error: 'Chua dang nhap',
      })
      .end();
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
routes.get('/api/token-auth02-firebase', async (req, res) => {
  const token = await getAccessToken();
  res.send({
    success: true,
    token,
  });
});
function getAccessToken() {
  const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
  const SCOPES = [MESSAGING_SCOPE];
  return new Promise((resolve, reject) => {
    const key = require('../../configs/datn-39295-firebase-adminsdk-nwmh3-1fc8ad5e61');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null,
    );
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
module.exports = routes;
