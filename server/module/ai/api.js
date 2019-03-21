const routes = require('express').Router();
const passport = require('passport');
const svm = require('node-svm');
const jwt = require('jsonwebtoken');
const User = require('../employee/model');
const config = require('../../configs/index');
async function training() {
  return new Promise(async (resolve, reject) => {
    User.find(
      {
        role: 1000,
        training: { $exists: true },
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
routes.post('/', async (req, res) => {
  try {
    const { dataTraining, dataTest } = await training();
    const clf = new svm.SVM({
      svmType: 'C_SVC',
      gamma: 10,
      c: 4, // allow you to evaluate several values during training
      normalize: false,
      reduce: false,
      kFold: 1, // disable k-fold cross-validation
      probability: true,
    });
    let labels = []
    let trueLabels = [];
    let predictedLabels = [];
    const accurancy = 0;
    const f1Score = 0;
    const recall = 0;
    const precision = 0;
    clf
      .train(dataTraining)
      .progress(progress => {
        console.log('training progress: %d%', Math.round(progress * 100));
      })
      .spread((model, reportTraining) => {
        // console.log('training report: %s\nPredictions:', so(report));\\
        labels = model.labels
        console.log(model.labels)
        dataTest.forEach(ex => {
          const prediction = clf.predictSync(ex[0]);

          trueLabels = [...trueLabels, ex[1]];
          predictedLabels = [...predictedLabels, prediction];
          clf.predictProbabilities(ex[0]).then(probabilities => {
            if (prediction !== ex[1]) {
              console.log('false');
            }
            if (probabilities[prediction] < 0.2) {
              console.log(
                `Label: ${
                  ex[1]
                } label predict: ${prediction} with probabilitie less 0.2: ${
                  probabilities[prediction]
                }`,
              );
            } else {
              console.log(
                `Label: ${
                  ex[1]
                } label predict: ${prediction} with probabilitie: ${
                  probabilities[prediction]
                }`,
              );
            }
          });
          // console.log('   %d  => %d', ex[1], prediction);
        });
        return {
          reportTraining,
          reportDataTest: clf.evaluate(dataTest),
        };
      })
      .done(({ reportTraining, reportDataTest }) => {
        // console.log(testReport)
        res.send({
          labels,
          trueLabels,
          predictedLabels,
          reportTraining,
          reportDataTest,
        });
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = routes;
