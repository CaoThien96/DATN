import React, { Component } from 'react';
import styled from 'styled-components';
import TrainingImage from '../../Attendance/components/bbt3.jpg';
import { getFaceDetectorOptions } from '../common/faceDetectionControls';
import { drawDetections } from '../common/drawing';

const DivWrapper = styled.div`
  position: relative;
`;

const VideoTag = styled.video`
  position: absolute;
`;
const CanvasTag = styled.canvas`
  position: absolute;
`;
class CameraWrapper extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.imageTag = React.createRef();
    this.canvasRef = React.createRef();
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    // this.videoTag.current.srcObject = stream;
    // console.log({ faceapi });
    // const options = getFaceDetectorOptions();
    // console.log({ options });
    // console.log(faceapi.nets.tinyFaceDetector.params);
    // const result = await faceapi.detectAllFaces(this.imageTag.current, options);
    // console.log({ result });
    // drawDetections(this.imageTag.current, this.canvasRef.current, result);
  }

  onPlay = async () => {
    console.log('onplay');
    if (
      !this.videoTag.current.currentTime ||
      this.videoTag.current.paused ||
      this.videoTag.current.ended ||
      !faceapi.nets.tinyFaceDetector.params
    )
      return setTimeout(() => this.onPlay(this.videoTag.current));
    const options = getFaceDetectorOptions();
    console.log({ options });
    const result = await faceapi.detectAllFaces(this.videoTag.current, options);
    console.log({ result });
    drawDetections(this.imageTag.current, this.canvasRef.current, result);
    setTimeout(() => this.onPlay(this.videoTag.current));
  };

  grabFrame = () => {};

  onGrabFrame = () => {};

  render() {
    return (
      <DivWrapper>
        <VideoTag
          // style={{ position: 'absolute' }}
          onPlay={this.onPlay}
          ref={this.videoTag}
          width="640"
          height="480"
          controls
          // autoPlay
          muted
        />
        <img
          style={{ position: 'absolute', display: 'none' }}
          ref={this.imageTag}
          src={TrainingImage}
          alt=""
        />
        <CanvasTag ref={this.canvasRef} id="overlay" />
      </DivWrapper>
    );
  }
}

export default CameraWrapper;
