import React, { Component } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Button from 'antd/es/button/button';
import TrainingImage from '../../Attendance/components/bbt3.jpg';
import { getFaceDetectorOptions } from '../common/faceDetectionControls';
import { drawDetections } from '../common/drawing';
import { onPredict, onPredictResult } from '../actions';
import {
  makeSelectCurrentUser,
  makeSelectError,
} from '../../../../App/selectors';
import {
  makeSelectObject,
  makeSelectPredict,
  makeSelectPending,
} from '../seclectors';

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
      pending: 0,
      numPerson: 0,
    };
  }

  componentWillUnmount() {
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks()[0].stop();
    }
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.videoTag.current.srcObject = stream;
    this.setState({
      localStream: stream,
    });
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
    const tmpHtmlMedia = faceapi.createCanvasFromMedia(this.videoTag.current);
    const result = await faceapi
      .detectSingleFace(tmpHtmlMedia, options)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (result) {
      const alignedRect = result.alignedRect;
      if (!this.props.pending) {
        this.onRecognition(result);
      }
      drawDetections(this.imageTag.current, this.canvasRef.current, [
        alignedRect,
      ]);
    } else {
      drawDetections(this.imageTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current));
  };

  onRecognition(result) {
    this.props.onPredict(result.descriptor);
  }

  onStop = () => {
    this.videoTag.current.stop();
  };

  onContinue = () => {
    this.videoTag.current.play();
  };

  changeState = () => {
    this.setState({ images: 1 });
  };

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
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  object: makeSelectObject(),
  predict: makeSelectPredict(),
  pending: makeSelectPending(),
});
const mapDispatchToProps = dispatch => ({
  onPredict: payload => dispatch(onPredict(payload)),
  onPredictResult: payload => dispatch(onPredictResult(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(CameraWrapper));
