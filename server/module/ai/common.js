const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');
require('tfjs-node-save');
module.exports.getDataSetTfModel = (numberClass, users) => {
  users = users.slice(0, numberClass);
  let xTrainFull = [];
  let yTrainFull = [];
  let xValidation = [];
  let yValidation = [];
  let xTestFull = [];
  let yTestFull = [];
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const label = index;
    const descriptors = JSON.parse(element.training)._descriptors;
    const numDescriptor = descriptors.length;
    let training = [];
    let test = [];
    let validation = [];
    const numTraining = parseInt((numDescriptor * 60) / 100);
    const numValidation =
      parseInt((numDescriptor * 20) / 100) < 1
        ? 1
        : parseInt((numDescriptor * 20) / 100);
    const ys = tf.oneHot(
      tf.fill([1, numDescriptor], index, 'int32').as1D(),
      numberClass,
    );

    training = descriptors
      .slice(0, numTraining)
      .map(des => tf.tensor2d(Object.values(des), [1, 128]));
    const xTrain = tf.concat(training);
    const ytrain = tf.slice(ys, 0, numTraining);
    xTrainFull.push(xTrain);
    yTrainFull.push(ytrain);

    validation = descriptors
      .slice(numTraining, numTraining + numValidation)
      .map(des => tf.tensor2d(Object.values(des), [1, 128]));
    const xVal = tf.concat(validation);
    const yVal = tf.slice(ys, numTraining, numValidation);
    xValidation.push(xVal);
    yValidation.push(yVal);

    test = descriptors
      .slice(numTraining + numValidation)
      .map(des => tf.tensor2d(Object.values(des), [1, 128]));
    const xTest = tf.concat(test);
    const yTest = tf.slice(ys, numTraining + numValidation, -1);
    xTestFull.push(xTest);
    yTestFull.push(yTest);
  }
  xTestFull = tf.concat(xTestFull);
  yTestFull = tf.concat(yTestFull);
  xTrainFull = tf.concat(xTrainFull);
  yTrainFull = tf.concat(yTrainFull);
  xValidation = tf.concat(xValidation);
  yValidation = tf.concat(yValidation);
  return {
    xTrainFull,
    yTrainFull,
    xTestFull,
    yTestFull,
    xValidation,
    yValidation,
  };
};
module.exports.getModel = numberClass => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [128],
      activation: 'sigmoid',
      units: 128,
    }),
  );

  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(
    tf.layers.dense({
      activation: 'softmax',
      units: numberClass,
    }),
  );
  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(0.01),
    metrics: ['accuracy'],
  });
  return model;
};

module.exports.saveModel = async model => {
  const pathSave = path.resolve(__dirname, '../../../public/model');
  try {
    await model.save(`file://${pathSave}`);
    return true;
  } catch (e) {
    return e;
  }
};
module.exports.trainModel = async ({
  xTrainFull,
  yTrainFull,
  xTestFull,
  yTestFull,
  numberClass,
}) => {
  const model = this.getModel(numberClass);
  const history = await model.fit(xTrainFull, yTrainFull, {
    epochs: 100,
    // validationData: [xTestFull, yTestFull],
    // validationSplit:0.4,
    shuffle: true,
    callbacks: {
      onBatchEnd: (onBatch, x) => {
        // console.log(onBatch)
      },
      onEpochEnd: async (epoch, logs) => {
        console.log(logs);
        valAcc = logs.val_acc;
        // console.log(`Epoch ${epoch} Accuracy:${valAcc}`)
        if (logs.acc * 100 > 99) {
          model.stopTraining = true;
        } else {
          await tf.nextFrame();
        }
        // await tf.nextFrame();
      },
    },
  });
  console.log(history);
  return model;
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
};
