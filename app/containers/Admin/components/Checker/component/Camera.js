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
    this.state = {
      object: false,
    };
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.videoTag.current.srcObject = stream;
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
    const result = await faceapi.detectSingleFace(this.videoTag.current, options).withFaceLandmarks().withFaceDescriptor();
    console.log(result)

    if(result){
      const alignedRect = result.alignedRect
      this.onRecognition();
      drawDetections(this.imageTag.current, this.canvasRef.current, [alignedRect]);
    }else {
      drawDetections(this.imageTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current));
  };
  onRecognition(){
    // setTimeout(()=>this.setState())
  }
  onStop = ()=>{
    this.videoTag.current.stop()
  }
  onContinue = ()=>{
    this.videoTag.current.play()
  }
  changeState=()=>{
    this.setState({images:1})
  }
  render() {
    return (
      <DivWrapper>
        <VideoTag
          // style={{ position: 'absolute' }}
          onPlay={this.onPlay}
          ref={this.videoTag}
          width="594"
          height="383"
          controls
          autoPlay
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
