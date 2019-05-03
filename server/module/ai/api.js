const routes = require('express').Router();
const passport = require('passport');
global.fetch = require('node-fetch');
// const svm = require('node-svm');
const jwt = require('jsonwebtoken');
const tf = require('@tensorflow/tfjs');
const faceapi = require('face-api.js');
const fs = require('fs');
const User = require('../employee/model');
const config = require('../../configs/index');
const commonPath = require('../../common/path');
const commonControll = require('./common');
const job  = require('../../configs/JobExcuse')

async function training() {
  return new Promise(async (resolve, reject) => {
    User.find(
      {
        role: 1000,
        training: { $exists: true },
        status: 1,
      },
      async (err, users) => {
        if (err) {
          return reject(err);
        }
        const numberClass = users.length;
        const { dataTraining, dataTest } = await getDataSet(numberClass, users);
        return resolve({ dataTraining, dataTest });
      },
    );
  });
}

/**
 *
 * @param numberClass
 * @param users
 * @returns {Promise<{dataTraining: Array, dataTest: Array}>}
 */
async function getDataSet(numberClass, users) {
  let dataTraining = [];
  let dataTest = [];
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const label = element.iid;
    const descriptors = JSON.parse(element.training)._descriptors;
    const numDescriptor = descriptors.length;
    let training = [];
    let test = [];
    const numTraining = parseInt((numDescriptor * 70) / 100);
    training = descriptors
      .slice(0, numTraining)
      .map(des => [Object.values(des), label]);

    dataTraining = [...dataTraining, ...training];
    test = descriptors
      .slice(numTraining)
      .map(des => [Object.values(des), label]);
    dataTest = [...dataTest, ...test];
  }
  return {
    dataTraining,
    dataTest,
  };
}
async function getDataSetFetchMatcher(numberClass, users) {
  let testData = [];
  const labelDescriptors = users.map(el => {
    let descriptors = JSON.parse(element.training)._descriptors;
    descriptors = descriptors.map(des => new Float32Array(Object.values(des)));
    const numDescriptor = descriptors.length;
    const numTraining = parseInt((numDescriptor * 70) / 100);
    const test = descriptors.slice(numTraining).map(des => ({
      label: el.label,
      descriptor: des,
    }));
    testData = [...testData, ...test];
    return new faceapi.LabeledFaceDescriptors(
      el.label,
      descriptors.slice(0, numTraining),
    );
  });
  return {
    testData,
    fetchMatcher: new faceapi.FaceMatcher(labeledDescriptors, 0.5),
  };
}
routes.get('/testIo', (req, res) => {
  const connected = req.app.io.connected;
  console.log({ connected });
  job.createCheckin();
});
routes.post('/', async (req, res) => {
  // try {
  //   const { dataTraining, dataTest } = await training();
  //   console.log(dataTest[0][0]);
  //   const clf = new svm.SVM({
  //     svmType: 'C_SVC',
  //     gamma: 10,
  //     c: 4, // allow you to evaluate several values during training
  //     normalize: false,
  //     reduce: false,
  //     kFold: 1, // disable k-fold cross-validation
  //     probability: true,
  //   });
  //   let labels = [];
  //   let trueLabels = [];
  //   let predictedLabels = [];
  //   const accurancy = 0;
  //   const f1Score = 0;
  //   const recall = 0;
  //   const precision = 0;
  //   clf
  //     .train(dataTraining)
  //     .progress(progress => {
  //       console.log('training progress: %d%', Math.round(progress * 100));
  //     })
  //     .spread((model, reportTraining) => {
  //       // console.log('training report: %s\nPredictions:', so(report));\\
  //       labels = model.labels;
  //       console.log(model.labels);
  //       dataTest.forEach(ex => {
  //         const prediction = clf.predictSync(ex[0]);
  //
  //         trueLabels = [...trueLabels, ex[1]];
  //         predictedLabels = [...predictedLabels, prediction];
  //         clf.predictProbabilities(ex[0]).then(probabilities => {
  //           if (probabilities[prediction] > 0.6) {
  //             if (prediction !== ex[1]) {
  //               console.log('Sai');
  //             }
  //             console.log(
  //               `Label: ${ex[1]} label predict ${
  //                 prediction !== ex[1] ? 'sai' : 'dung'
  //               }: ${prediction} with probabilitie > 0.6: ${
  //                 probabilities[prediction]
  //               }`,
  //             );
  //           }
  //           // else {
  //           //   console.log(
  //           //     `Label: ${
  //           //       ex[1]
  //           //     } label predict: ${prediction} with probabilitie: ${
  //           //       probabilities[prediction]
  //           //     }`,
  //           //   );
  //           // }
  //         });
  //         // console.log('   %d  => %d', ex[1], prediction);
  //       });
  //       return {
  //         reportTraining,
  //         reportDataTest: clf.evaluate(dataTest),
  //       };
  //     })
  //     .done(({ reportTraining, reportDataTest }) => {
  //       // console.log(testReport)
  //       res.send({
  //         labels,
  //         trueLabels,
  //         predictedLabels,
  //         reportTraining,
  //         reportDataTest,
  //       });
  //     });
  // } catch (e) {
  //   res.send(e);
  // }
});
routes.post('/train-tf-model', (req, res) => {});
routes.get('/dataset', async (req, res) => {
  try {
    let numberClass = 12;
    const users = await User.find({
      role: 1000,
      training: { $exists: true },
      status: 1,
    });
    numberClass = users.length;
    let {
      xTrainFull,
      yTrainFull,
      xTestFull,
      yTestFull,
    } = commonControll.getDataSetTfModel(users.length, users);
    xTrainFull = xTrainFull.arraySync();
    yTrainFull = yTrainFull.arraySync();
    xTestFull = xTestFull.arraySync();
    yTestFull = yTestFull.arraySync();
    console.log({
      xTrainFull,
      yTrainFull,
      xTestFull,
      yTestFull,
    });
    // let valAcc;
    const model = commonControll.getModel(numberClass);
    // const history = await model.fit(xTrainFull, yTrainFull, {
    //   batchSize: 7,
    //   epochs: 100,
    //   // validationData: [xTestFull, yTestFull],
    //   // validationSplit:0.4,
    //   shuffle: true,
    //   callbacks: {
    //     onBatchEnd: (onBatch, x) => {
    //       // console.log(onBatch)
    //     },
    //     onEpochEnd: async (epoch, logs) => {
    //       console.log(logs);
    //       valAcc = logs.val_acc;
    //       // console.log(`Epoch ${epoch} Accuracy:${valAcc}`)
    //       if (logs.acc * 100 > 99) {
    //         model.stopTraining = true;
    //       } else {
    //         await tf.nextFrame();
    //       }
    //       // await tf.nextFrame();
    //     },
    //   },
    // });
    // const yPredict = model.predict(xTestFull);
    // yPredict.print(true);
    // yPredict.argMax(1).print();
    // yTestFull.print(true);
    // console.log(history.history.loss[0]);
    // const testResult = model.evaluate(xTestFull, yTestFull);
    // const testAccPercent = testResult[1].dataSync()[0] * 100;
    // const finalValAccPercent = valAcc * 100;
    // console.log(
    //   `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
    //     `Final test accuracy: ${testAccPercent.toFixed(1)}%
    //         `,
    // );
    // const out = tf.math.confusionMatrix(
    //   yTestFull.argMax(1),
    //   yPredict.argMax(1),
    //   numberClass,
    // );
    // out.print();

    res.send({
      success: true,
      xTrainFull,
      yTrainFull,
      xTestFull,
      yTestFull,
      numberClass,
      users,
    });
  } catch (e) {
    res.send(e);
  }
});
routes.post('/save', async (req, res) => {

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const tmp = Object.values(req.files);
  const modelJson = tmp[0];
  const modelWeight = tmp[1];
  const pathSave = commonPath.pathModel;

  // Use the mv() method to place the file somewhere on your server
  modelJson.mv(`${pathSave}/${modelJson.name}`, err => {
    if (err) return res.status(500).send(err);
    modelWeight.mv(`${pathSave}/${modelWeight.name}`, err => {
      if (err) return res.status(500).send(err);
      req.app.io.emit('action', {
        type: 'boilerplate/App/Should_Update_Model',
        payload: 'dasdasda',
      });
      res.send('File uploaded!');
    });
  });
});
routes.post('/saveImage', (req, res) => {
  console.log(req.files);
  const files = Object.values(req.files);
  const pathSave = commonPath.pathAvatar;
  files[0].mv(`${pathSave}/${files[0].name}`, err => {
    res.send({
      success: true,
    });
  });
});
module.exports = routes;
