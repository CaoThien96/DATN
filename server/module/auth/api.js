const routes = require('express').Router();
const passport = require('passport');

routes.post('/sign-in', (req, res, next) =>
  passport.authenticate('local-sign-in', { session: false }, (err, token) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({
      success: true,
      token,
      message: 'user found & logged in',
    });
  })(req, res, next),
);
module.exports = routes;
