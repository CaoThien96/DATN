import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Button from 'antd/es/button/button';
import { Layer, Rect, Stage, Text } from 'react-konva';
import Link from 'react-router-dom/es/Link';
import List from 'antd/es/list';
import cloneDeep from 'lodash/cloneDeep';
import request from '../../../../../../utils/request';

class Training extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.state = {
      options: undefined,
      localStream: undefined,
      ctx: undefined,
      interval: undefined,
      faces: [],
      boxs: [],
      descriptors: [],
      imgCrop: [],
      isTraining: true,
    };
  }

  componentDidMount() {
    this.setState({
      ctx: this.canvasTag.current.getContext('2d'),
    });
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        this.setState({
          localStream: stream,
        });
        return (this.videoTag.current.srcObject = stream);
      })
      .catch(console.log);
    // tiny_face_detector options
    const inputSize = 128;
    const scoreThreshold = 0.5;
    this.setState({
      options: new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      }),
    });
  }

  componentWillUnmount() {
    this.handeStopStream();
    // this.videoTag.current.srcObject = undefined;
    // this.videoTag.current.pause();
  }

  handleSaveTrainingData = () => {
    const labelFaceDetector = new faceapi.LabeledFaceDescriptors(
      '1000',
      this.state.descriptors,
    );
    request('/api/employee', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ id: 1000, labelFaceDetector }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {})
      .catch(err => {
        alert(JSON.stringify(err));
      });
  };

  cropFace = async () => {
    const imgCrop = this.state.boxs.map(({ box, dataUrl }) => {
      const image = new Image();
      image.src = dataUrl;
      return new Promise(resolve => {
        image.onload = () => resolve({ box, image });
      });
    });
    Promise.all(imgCrop)
      .then(data =>
        data.map(({ box, image }) => {
          const { x, y, width, height } = box;
          const destWidth = width;
          const destHeight = height;
          const destX = 0;
          const destY = 0;
          this.canvasTag.current.width = width;
          this.canvasTag.current.height = height;
          // context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
          this.state.ctx.drawImage(
            image,
            x,
            y,
            width,
            height,
            destX,
            destY,
            destWidth,
            destHeight,
          );
          return this.canvasTag.current.toDataURL();
        }),
      )
      .then(data => {
        this.setState({
          imgCrop: data,
        });
      });
  };

  pause = () => {
    console.log(this.state)
    clearInterval(this.state.interval);

    this.setState({
      interval: undefined,
      faces: [],
    });

    // this.videoTag.current.pause();
    // this.handeStopStream();
  };

  handleFrame = async () => {
    console.log(this.videoTag);
    if (this.state.boxs.length > 9) {
      this.pause();
      return;
    }
    if (this.videoTag) {
      this.state.ctx.drawImage(this.videoTag.current, 0, 0, 640, 480);
      const dataUrl = this.canvasTag.current.toDataURL();
      const start = new Date();
      const faceDetectionTask = await faceapi
        .detectSingleFace(this.videoTag.current, this.state.options)
        .withFaceLandmarks();
      const end = new Date();

      if (faceDetectionTask) {
        // console.log(
        //   `Thoi gian detected face: ${end.getTime() - start.getTime()}`,
        // );
        const tmpBox = faceDetectionTask.alignedRect.box;
        if (tmpBox.width > 200) {
          this.setState(prevState => {
            const boxs = [...prevState.boxs, { box: tmpBox, dataUrl }];
            return {
              boxs,
            };
          });
          this.setState({
            faces: [tmpBox],
          });
        }
      }
    }
  };

  createStream = () =>
    new Promise(resolve => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.setState({
            localStream: stream,
          });
          console.log('new stream');
          this.videoTag.current.srcObject = stream;
          return resolve(stream);
        })
        .catch(console.log);
    });

  onPlay = async () => {
    console.log(this.state.isTraining);
    if (this.state.boxs.length) {
      // await this.createStream();
      console.log('trainning lai');
      this.canvasTag.current.width = 640;
      this.canvasTag.current.height = 480;
      this.setState({
        imgCrop: [],
        boxs: [],
        ctx: this.canvasTag.current.getContext('2d'),
        faces: [],
      });
    }

    if (this.state.isTraining) {
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }
      this.videoTag.current.play();
      this.setState({
        interval: setInterval(this.handleFrame, 1000 / 32),
      });
    } else {
      clearInterval(this.state.interval);
      this.setState({
        interval: undefined,
      });
      // this.videoTag.current.pause();
    }
  };

  handeStopStream = () => {
    this.state.localStream.getVideoTracks()[0].stop();
  };

  render() {
    const { faces } = this.state;
    return (
      <div>
        <Row>
          <Col span={12}>
            <div
              style={{ position: 'relative', width: '640px', height: '480px' }}
            >
              <video
                style={{ position: 'absolute' }}
                width="640"
                onLoad={() => console.log('load sucess')}
                // onPlay={this.onPlay}
                height="480"
                // controls
                autoPlay
                ref={this.videoTag}
              />
              <div style={{ position: 'absolute' }}>
                <Stage width={640} height={480}>
                  <Layer>
                    {faces &&
                      faces.map(({ x, y, width, height }) => (
                        <Rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          stroke="green"
                        />
                      ))}
                  </Layer>
                </Stage>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <canvas
              style={{ display: 'none' }}
              // style={{ position: 'absolute' }}
              width="640"
              height="480"
              ref={this.canvasTag}
            />
            <List
              grid={{ column: 2 }}
              dataSource={this.state.imgCrop}
              pagination={{
                pageSize: 4,
              }}
              renderItem={item => (
                <List.Item>
                  <img src={item} width={250} height={240} alt="" />
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <div>
          <Button type="danger" onClick={this.onPlay}>
            Start training
          </Button>
          <Button type="danger" onClick={this.cropFace}>
            Capture
          </Button>
          <Button type="primary">
            <Link to="/admin/employee/training/1000/test">Test</Link>
          </Button>
          <Button type="primary" onClick={this.handeStopStream} shape="circle">
            {this.state.imgCrop && this.state.imgCrop.length}
          </Button>
        </div>
      </div>
    );
  }
}

Training.defaultProps = {};
Training.propTypes = {};

export default Training;
