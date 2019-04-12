const fs = require('fs');
const tf = require('@tensorflow/tfjs');
module.exports.getDataSetTfModel = (numberClass, users) => {
  users = users.slice(0, numberClass);
  let xTrainFull = [];
  let yTrainFull = [];
  let xTestFull = [];
  let yTestFull = [];
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const label = index;
    const descriptors = JSON.parse(element.training)._descriptors;
    const numDescriptor = descriptors.length;
    let training = [];
    let test = [];
    const numTraining = parseInt((numDescriptor * 70) / 100);
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
    test = descriptors
      .slice(numTraining)
      .map(des => tf.tensor2d(Object.values(des), [1, 128]));
    const xTest = tf.concat(test);
    const yTest = tf.slice(ys, numTraining, -1);
    xTestFull.push(xTest);
    yTestFull.push(yTest);
  }
  xTestFull = tf.concat(xTestFull);
  yTestFull = tf.concat(yTestFull);

  xTrainFull = tf.concat(xTrainFull);
  yTrainFull = tf.concat(yTrainFull);
  return {
    xTrainFull,
    yTrainFull,
    xTestFull,
    yTestFull,
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
