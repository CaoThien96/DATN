const CronJob = require('cron').CronJob;
const moment = require('moment');
const tf = require('@tensorflow/tfjs');
const User = require('../module/employee/model');
const Configuration = require('../module/configuration/model');
const CheckIn = require('../module/checkin/model');
const Request = require('../module/request/model');
const CheckInDetail = require('../module/checkin/model/check_in_detail');
const commonControll = require('../module/ai/common');
async function createCheckin() {
  try {
    const users = await User.find({ role: 1000, status: 1 });
    const newCheckIn = new CheckIn();
    newCheckIn.date = new Date();
    const y = new Date().getFullYear();
    const m = new Date().getMonth();
    const d = new Date().getDate();
    CheckIn.create(
      { date: new Date(y, m, d, 0, 5, 0).getTime() },
      async (err, candies) => {
        if (err) {
          console.log({ err });
        } else {
          let newCheckInDetail = [];
          for (let i = 0; i < users.length; i++) {
            const el = users[i];
            try {
              const request = await Request.findRequestByUserMatchTime(
                users[i],
              );

              if (request) {
                newCheckInDetail = [
                  ...newCheckInDetail,
                  {
                    user: el,
                    pid: candies.iid,
                    status: 3,
                  },
                ];
              } else {
                newCheckInDetail = [
                  ...newCheckInDetail,
                  {
                    user: el,
                    pid: candies.iid,
                  },
                ];
              }
            } catch (e) {
              newCheckInDetail = [
                ...newCheckInDetail,
                {
                  user: el,
                  pid: candies.iid,
                },
              ];
            }
          }
          CheckInDetail.insertMany(newCheckInDetail, (error, docs) => {
            if (error) {
              console.log({ error });
            } else {
              console.log({ docs });
            }
          });
        }
      },
    );
  } catch (e) {}
}
async function saveAndUpdateModel() {
  console.log(`chay train va save model ${new Date().toDateString()}`);

  try {
    const users = await User.find({
      role: 1000,
      training: { $exists: true },
      status: 1,
    });
    const numberClass = users.length;
    let {
      xTrainFull,
      yTrainFull,
      xTestFull,
      yTestFull,
      xValidation,
      yValidation
    } = commonControll.getDataSetTfModel(users.length, users);
    xTrainFull = xTrainFull.arraySync();
    yTrainFull = yTrainFull.arraySync();
    xTestFull = xTestFull.arraySync();
    yTestFull = yTestFull.arraySync();

    xValidation = xValidation.arraySync();
    yValidation = yValidation.arraySync();

    xTrainFull = tf.tensor2d(xTrainFull);
    yTrainFull = tf.tensor2d(yTrainFull);

    xTestFull = tf.tensor2d(xTestFull);
    yTestFull = tf.tensor2d(yTestFull);

    xValidationFull = tf.tensor2d(xValidation);
    yValidationFull = tf.tensor2d(yValidation);


    // let valAcc;
    const model = commonControll.getModel(numberClass);
    const history = await model.fit(xTrainFull, yTrainFull, {
      epochs: 20,
      validationData: [xValidationFull, yValidationFull],
      // validationSplit:0.4,
      shuffle: true,
      callbacks: {
        onBatchEnd: (onBatch, x) => {
          // console.log(onBatch)
        },
        onEpochEnd: async (epoch, logs) => {
          const valAcc = logs.acc;
          console.log(`Epoch ${epoch} Accuracy:${valAcc}`);
          if (logs.acc * 100 > 99) {
            model.stopTraining = true;
          } else {
            await tf.nextFrame();
          }
        },
      },
    });
    commonControll.saveModel(model);
  } catch (e) {
    console.log(e);
  }
}
module.exports = {
  createCheckin,
  saveAndUpdateModel,
};
