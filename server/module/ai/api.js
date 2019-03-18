const routes = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../employee/model');
const config = require('../../configs/index');

module.exports = routes
