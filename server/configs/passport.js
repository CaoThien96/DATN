const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const Users = require('../module/employee/model');
const config = require('./index');
passport.use(
  'local-sign-in',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      const userData = {
        email: username.trim(),
        password: password.trim(),
      };
      return Users.findOne(
        {
          email: userData.email,
        },
        (err, user) => {
          if (!user) {
            const error = new Error('Incorrect email');
            error.name = 'Incorrect email';
            return done(error);
          }
          return user.comparePassword(
            userData.password,
            (passwordErr, isMatch) => {
              if (err) {
                return done(err);
              }
              if (!isMatch) {
                const error = new Error('Incorrect password');
                error.name = 'Incorrect password';

                return done(error);
              }
              const payload = {
                sub: user._id,
              };
              // create a token string
              const token = jwt.sign(payload, config.jwtSecret);
              return done(null, token);
            },
          );
        },
      );
    },
  ),
);
