/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const socket_io = require('socket.io');
const logger = require('./logger');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./configs/db');
require('./configs/cronJob');
const createJob = require('./configs/cronJobV2');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const api = require('./middlewares/apiMiddlewares');
const socketController = require('./module/socket/index');
const User = require('./module/employee/model');

const config = require('./configs/index');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();
let usersConnected = [];
app.usersConnected = usersConnected;
const jobs = [];
app.jobs = jobs;
/**
 * Implement passport
 */
app.use(fileUpload());
app.use(cors());
app.use(express.static('public'));
// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(passport.initialize());
require('./configs/passport');
// In production we need to pass these values in instead of relying on webpack
api(app);
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});
const io = socket_io();

io.listen(
  // Start your app.
  app.listen(port, host, async err => {
    if (err) {
      return logger.error(err.message);
    }
    try {
      const jobCreateJobCheckIn = await createJob.createJobCheckIn();
      jobs.push({
        name: 'createJobCheckIn',
        job: jobCreateJobCheckIn,
      });
      const jobUpdateModel = await createJob.createJobUpdateModel();
      jobs.push({
        name: 'createJobUpdateModel',
        job: jobUpdateModel,
      });
      const jobCheckRequestOutOfDate = await createJob.createJobCheckRequest();
      jobs.push({
        name: 'jobCheckRequestOutOfDate',
        job: jobCheckRequestOutOfDate,
      });
      jobs.map(j => {
        console.log(j.name)
        j.job.start();
      });
    }catch (e) {
      console.log(e)
    }

    /**
     * Load model
     * @type {any}
     */
    // app.newClf = svm.restore(modelSave);
    console.error(
      `Node cluster worker ${process.pid}: listening on port ${port}`,
    );

    // Connect to ngrok in dev mode
    if (ngrok) {
      let url;
      try {
        url = await ngrok.connect(port);
      } catch (e) {
        return logger.error(e);
      }
      logger.appStarted(port, prettyHost, url);
    } else {
      logger.appStarted(port, prettyHost);
    }
  }),
);

app.io = io.on('connection', async socket => {
  app.socket = socket;
  const id = socket.id;

  console.log(`Socket connected: ${socket.id}`);
  jwt.verify(socket.handshake.query.token, config.jwtSecret, (err, decoded) => {
    if (err) {
      console.log('client chua dang nhap');
    } else {
      const userId = decoded.sub;
      // check if a user exists
      // check if a user exists
      User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          console.log('client chua dang nhap');
        }
        console.log(`client dang nhap voi socket id: ${id}`);
        // pass user details onto next route
        const isUser = usersConnected.findIndex(el => {
          if (el.user.iid == user.iid) {
            return true;
          }
          return false;
        });
        if (isUser == -1) {
          usersConnected.push({ id, user });
        }
        console.log(`Danh sach nguoi dung da dang nhap`);
        for (let i = 0; i < usersConnected.length; i++) {
          console.log(
            `${i + 1}: ${usersConnected[i].user.email} voi socket id: ${
              usersConnected[i].id
            }`,
          );
        }
      });
    }
  });
  socket.on('disconnect', () => {
    console.log(`Socket disconnect ${socket.id}`);
    usersConnected = usersConnected.filter(el => {
      if (el.id === socket.id) {
        return false;
      }
      return true;
    });
  });
  socket.on('action', async action => {
    if (action.type === 'server/hello') {
      socket.broadcast.emit('action', { type: 'message', data: 'good day!' });
      // socket.broadcast.emit('broadcast', 'hello friends!');
      // io.emit('action', { type: 'message2', data: 'good day!' });
    }
    /**
     * Lang nghe su kien them comment
     */
    if (action.type === 'server/boilerplate/Notification/AddComment') {
      const newPayload = { ...action.payload, time: new Date() };
      const onAddCommentNotification = await socketController.handleAddCommentNotification(
        io,
        socket,
        action,
      );
      // socket.broadcast.emit('action', {
      //   type: 'boilerplate/Notification/OnAddComment',
      //   payload: newPayload,
      // });
    }
    if (action.type === 'server/boilerplate/Request/AddComment') {
      const onAddComment = await socketController.handleAddCommentRequest(
        app.io,
        socket,
        action,
      );
      console.log(onAddComment);
    }

    /**
     * Lang nghe su kien yeu cau du doan
     * Neu du doan co xac xuat tren 0.3 thi cap nhat ket qua diem danh cho doi tuong do
     * Con neu du doan co xac xuat nho hon 0.3 10 lan thi ping ra mot thong bao khong nhan dang duoc doi tuong
     */
    if (action.type === 'server/boilerplate/Checker/OnPredict') {
      socketController.handleUpdateStatusCheckIn(socket, action);
    }
  });
});
