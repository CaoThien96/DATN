import React, { Component } from 'react';
import request from 'utils/request';
import { Layer, Rect, Stage } from 'react-konva';
import Button from 'antd/es/button/button';

class Index extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.state = {
      user: undefined,
      labelDesciptor: undefined,
      resultsRef: undefined,
      faceMatcher: undefined,
      options: undefined,
      interval: undefined,
      faces: undefined,
    };
  }

  componentWillMount() {
    request('/api/employee/1000').then(data => {
      let labelDesciptor = data.payload.training;
      labelDesciptor = JSON.parse(labelDesciptor);
      const descriptors = labelDesciptor._descriptors.map(el => {
        console.log({ el });
        return new Float32Array(Object.values(el));
      });
      console.log(descriptors);
      console.log(descriptors[0].length);
      const resultsRef = new faceapi.LabeledFaceDescriptors(
        labelDesciptor._label,
        descriptors,
      );
      const faceMatcher = new faceapi.FaceMatcher(resultsRef);
      this.setState({ user: data.payload, resultsRef, faceMatcher });
    });
  }

  async componentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (this.videoTag.current.srcObject = stream))
      .catch(console.log);
    // console.log(this.state.labelDesciptor)
    // const labelDesciptor = await new faceapi.LabeledFaceDescriptors(
    //   '1000',
    //   this.state.labelDesciptor._descriptors,
    // );
    // console.log(labelDesciptor);
    const inputSize = 512;
    const scoreThreshold = 0.5;
    this.setState({
      options: new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      }),
    });
  }

  grabFrame = async () => {
    try {
      const resultsQuery = await faceapi
        .detectSingleFace(this.videoTag.current, this.state.options)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (resultsQuery) {
        console.log(
          this.state.faceMatcher
            .findBestMatch(resultsQuery.descriptor)
            .toString(),
        );
      }
    } catch (e) {
      console.log(e);
    }
    // const des = await faceDetectionTask
    //   .withFaceLandmarks();
    //   .withFaceDescriptors();
  };

  handleTracking = () => {
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
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
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
        <div>
          <Button type="primary" onClick={this.handleTracking}>
            Tracking
          </Button>
        </div>
      </div>
    );
  }
}

export default Index;
