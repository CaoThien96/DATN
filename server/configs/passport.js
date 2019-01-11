const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../modules/User/model/user');
const config = require('./index');

exports.LocalSignIn = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      password: password.trim(),
    };
    // find a user by email address
    return User.findOne(
      {
        email: userData.email,
      },
      (err, user) => {
        if (!user) {
          const error = new Error('Incorrect email');
          error.name = 'IncorrectCredentialsError';
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
              error.name = 'IncorrectCredentialsError';

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
);

exports.LocalSignUp = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  (req, username, password, done) => {
    const userData = {
      email: username.trim(),
      password: password.trim(),
    };

    const newUser = new User(userData);
    newUser.save(err => {
      if (err) {
        return done(err);
      }

      return done(null);
    });
  },
);
