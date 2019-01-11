import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Button from 'antd/es/button/button';
import { Layer, Rect, Stage, Text } from 'react-konva';

class Training extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.state = {
      options: undefined,
      ctx: undefined,
      interval: undefined,
      faces: undefined,
    };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (this.videoTag.current.srcObject = stream))
      .catch(console.log);
    // tiny_face_detector options
    const inputSize = 512;
    const scoreThreshold = 0.5;
    this.setState({
      options: new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      }),
    });
  }

  componentWillUnmount() {
    this.videoTag.current.srcObject = undefined;
    this.videoTag.current.pause();
  }

  grabFrame = () => {
    console.log(this.videoTag.current);
    faceapi
      .detectAllFaces(this.videoTag.current, this.state.options)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .then(data => {
        console.log({ data });
      })
      .catch(err => console.log(err));
  };

  handleStartTraining = () => {
    console.log(this.videoTag);
    if (this.videoTag.current.paused) {
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }
      this.videoTag.current.play();
      this.setState({
        interval: setInterval(this.grabFrame, 1000 / 24),
      });
    } else {
      clearInterval(this.state.interval);
      this.setState({
        interval: undefined,
      });
      this.videoTag.current.pause();
    }
  };

  render() {
    const { faces } = this.state;
    return (
      <div>
        <Row>
          <Col span={24}>
            <div
              style={{ position: 'relative', width: '640px', height: '480px' }}
            >
              <video
                style={{ position: 'absolute' }}
                width="640"
                height="480"
                ref={this.videoTag}
              />
              <div style={{ position: 'absolute' }}>
                <Stage width={640} height={480}>
                  <Layer>
                    {faces &&
                      faces.map(face => {
                        const { x, y, width, height } = face.box;
                        return (
                          <Rect
                            key={face}
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            stroke="green"
                          />
                        );
                      })}
                  </Layer>
                </Stage>
              </div>
            </div>
          </Col>
        </Row>
        <div>
          <Button type="danger" onClick={this.handleStartTraining}>
            Start training
          </Button>
          <Button type="primary" onClick={this.handleStartTraining}>
            Test
          </Button>
        </div>
      </div>
    );
  }
}

Training.defaultProps = {};
Training.propTypes = {};

export default Training;
