/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const socket_io = require('socket.io');
const logger = require('./logger');
const bodyParser = require('body-parser');
const passport = require('passport');
const svm = require('node-svm');
const commonPath = require('./common/path');
require('./configs/db');
require('./configs/cronJob');
const createJob = require('./configs/cronJobV2');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const api = require('./middlewares/apiMiddlewares');

const User = require('./module/employee/model');
const Notification = require('./module/notification/model');
const CheckIn = require('./module/checkin/model');
const CheckInDetail = require('./module/checkin/model/check_in_detail');

const config = require('./configs/index');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();
const usersConnected = [];
const jobs = [];
app.jobs = jobs;
/**
 * Implement passport
 */

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
    jobs.map(j => {
      j.job.start();
    });
    /**
     * Load model
     * @type {any}
     */
    const modelSave = JSON.parse(fs.readFileSync(commonPath.model));
    app.newClf = svm.restore(modelSave);
    console.error(`load model succession`);
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
CheckIn.searchCheckIn(new Date(), (err, docs) => {
  CheckInDetail.findCheckInSuccess(docs[0], (err, listCheckSuccess) => {
    console.log({ docs, listCheckSuccess });
  });
});

app.io = io.on('connection', async socket => {
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
        // pass user details onto next route
        const isUser = usersConnected.findIndex(el => {
          if (el.iid == user.iid) {
            return true;
          }
          return false;
        });
        if (isUser) {
          usersConnected.push(user);
        }
        console.log(`Danh sach nguoi dung da dang nhap`);
        for (let i = 0; i < usersConnected.length; i++) {
          console.log(`${i + 1}: ${usersConnected[i].email}`);
        }
      });
    }
  });
  let check = 0;
  socket.on('action', async action => {
    if (action.type === 'server/hello') {
      socket.emit('action', { type: 'message', data: 'good day!' });
    }
    if (action.type === 'server/boilerplate/Notification/AddComment') {
      const newPayload = { ...action.payload, time: new Date() };
      socket.broadcast.emit('action', {
        type: 'boilerplate/Notification/OnAddComment',
        payload: newPayload,
      });
    }
    /**
     * Lang nghe su kien yeu cau du doan
     * Neu du doan co xac xuat tren 0.3 thi cap nhat ket qua diem danh cho doi tuong do
     * Con neu du doan co xac xuat nho hon 0.3 10 lan thi ping ra mot thong bao khong nhan dang duoc doi tuong
     */
    if (action.type === 'server/boilerplate/Checker/OnPredict') {
      console.log('emit');
      const descriptor = Object.values(action.payload);
      try {
        const prediction = app.newClf.predictSync(descriptor);
        const predictProbabilitiesSync = app.newClf.predictProbabilitiesSync(
          descriptor,
        );
        const probabilities = predictProbabilitiesSync[prediction];
        console.log({ prediction, probabilities });
        if (probabilities > 0.3) {
          const time = new Date();
          console.log(
            `Nhan dang duoc doi tuong ${prediction} vao luc ${time.toTimeString()}`,
          );
          const st = new Date();
          console.log('start update');
          CheckIn.searchCheckIn(new Date(), (err, doc) => {
            console.log({ err, doc });
            if (err) {
              console.log(err);
            } else {
              const checkIn = doc[0];
              CheckInDetail.findOne(
                { pid: checkIn.iid, 'user.iid': parseInt(prediction) },
                (err, check_in_detail) => {
                  if (check_in_detail.status === 0) {
                    check_in_detail.updateStatus((err, res) => {
                      const end = new Date();
                      console.log((end - st) / 1000);
                      CheckInDetail.findCheckInSuccess(
                        checkIn,
                        (err, listCheckSuccess) => {
                          console.log({ listCheckSuccess });
                          socket.emit('action', {
                            type: 'boilerplate/Check/OnUpdateListCheckIn',
                            payload: listCheckSuccess,
                          });
                        },
                      );
                    });
                  } else {
                    const end = new Date();
                    console.log('bo qua doi tuong da duoc check_in_detail');
                    console.log((end - st) / 1000);
                    CheckInDetail.findCheckInSuccess(
                      checkIn,
                      (err, listCheckSuccess) => {
                        console.log({ listCheckSuccess });
                        socket.emit('action', {
                          type: 'boilerplate/Check/OnUpdateListCheckIn',
                          payload: listCheckSuccess,
                        });
                      },
                    );
                  }
                },
              );
            }
          });
        } else {
          console.log('Unknown')
          socket.emit('action', {
            type: 'boilerplate/Check/OnPredictUnknown',
            payload: false,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
});
