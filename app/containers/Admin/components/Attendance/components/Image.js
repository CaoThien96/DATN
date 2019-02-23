import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import TrainingImage from './bbt3.jpg';

import TestImage from './bbt1.jpg';

class Image extends Component {
  constructor(props) {
    super(props);
    this.imageTag = React.createRef();
    this.resultTag = React.createRef();
    this.canvasTag = React.createRef();
    this.canvasTest = React.createRef();
    this.state = {
      src: undefined,
      options: undefined,
      ctx: undefined,
      test: undefined,
    };
  }

  async componentDidMount() {
    // console.log(tf)
    this.setState({
      ctx: this.canvasTag.current.getContext('2d'),
      test: this.canvasTest.current.getContext('2d'),
    });
    console.log('use face api');
    const inputSize = 512;
    const scoreThreshold = 0.5;
    const options = await new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold,
    });
    this.setState({
      options,
    });
    const faceDetections = await faceapi
      .detectAllFaces(this.imageTag.current, this.state.options)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const faceRef = await faceapi
      .detectAllFaces(this.resultTag.current, this.state.options)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const testData = tf.tensor2d(faceRef.map(item => item.descriptor));

    let i = 0;
    const x = [];
    const createBoxWithText = faceDetections.map(item => {
      x.push(i);
      return new faceapi.BoxWithText(item.detection.box, `${i++}`);
    });
    const trainingData = tf.tensor2d(
      faceDetections.map(item => item.descriptor),
    );
    const depth = x.length;
    const outputData = tf.oneHot(x, depth);
    // console.log(outputData);
    // console.log(createBoxWithText);

    let width = this.imageTag.current.width;
    let height = this.imageTag.current.height;
    this.canvasTag.current.width = width;
    this.canvasTag.current.height = width;
    this.state.ctx.drawImage(this.imageTag.current, 0, 0, width, height);
    faceapi.drawDetection(this.canvasTag.current, createBoxWithText);

    width = this.resultTag.current.width;
    height = this.resultTag.current.height;
    this.canvasTest.current.width = width;
    this.canvasTest.current.height = width;
    this.state.test.drawImage(this.resultTag.current, 0, 0, width, height);

    console.log(createBoxWithText);

    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [128],
        activation: 'sigmoid',
        units: 16,
      }),
    );
    model.add(
      tf.layers.dense({
        inputShape: [16],
        activation: 'sigmoid',
        units: 16,
      }),
    );
    model.add(
      tf.layers.dense({
        activation: 'sigmoid',
        units: depth,
      }),
    );
    model.compile({
      loss: 'meanSquaredError',
      optimizer: tf.train.adam(0.06),
    });
    // train/fit our network
    const startTime = Date.now();
    console.log({ trainingData, outputData });
    model.fit(trainingData, outputData, { epochs: 100 }).then(history => {
      console.log(history);
      const x = model.predict(testData);
      x.print();
      const axis = 1;
      const kq = x.argMax(axis);
      const y = 0;
      let tmp = x.dataSync();
      tmp = Array.from(tmp);

      const values = kq.dataSync();
      const arr = Array.from(values);
      console.log({ arr });
      const xx = [];
      for (let j = 0; j < arr.length; j++) {
        xx.push({
          index: arr[j],
          value: tmp[arr[j] + j * depth],
        });
      }
      console.log({xx})
      const boxWithText = faceRef.map(
        (item, key) =>
          xx[key].value > 0.8
            ? new faceapi.BoxWithText(item.detection.box, `${arr[key]}`)
            : new faceapi.BoxWithText(item.detection.box, `Khong_Xac_Dinh`),
      );
      faceapi.drawDetection(this.canvasTest.current, boxWithText);
    });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    console.log({ acceptedFiles, rejectedFiles });
    console.log(URL.createObjectURL(acceptedFiles[0]));
    console.log(this.imageTag);
    this.imageTag.current.src = URL.createObjectURL(acceptedFiles[0]);
  };

  render() {
    return (
      <div>
        <div>
          <img
            style={{ display: 'none' }}
            ref={this.imageTag}
            src={TrainingImage}
            alt=""
          />
          <canvas ref={this.canvasTag} />
        </div>
        <div>
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                style={{
                  height: '100px',
                  border: '2px dashed #666',
                  borderRadius: '5px',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop files here...</p>
                ) : (
                  <p>
                    Try dropping some files here, or click to select files to
                    upload.
                  </p>
                )}
              </div>
            )}
          </Dropzone>
        </div>
        <img ref={this.resultTag} src={TestImage} alt="" />
        <canvas ref={this.canvasTest} alt="no image" />
        <div />
      </div>
    );
  }
}

export default Image;
