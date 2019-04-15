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
    this.pendding = false;
    this.miss = 0;
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
      console.log({pendding:this.pendding,checkInManual:this.props.checkInManual})
      if (!this.pendding && !this.props.checkInManual) {
        this.pendding = true;
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
    const descriptor = result.descriptor;
    console.log(descriptor);
    this.props.model.summary();
    const tfDescriptor = tf.tensor2d(result.descriptor, [1, 128]);
    const yPredict = this.props.model.predict(tfDescriptor);
    let { values, indices } = tf.topk(yPredict);
    console.log({ values, indices });
    values = values.as1D().dataSync();
    indices = indices.as1D().dataSync();
    console.log(values);
    console.log(indices);

    if (values < 0.75) {
      // alert(`Không tim thay đối tượng`);
      // this.pendding = false;
      this.miss = this.miss+1;
      if(this.miss>2){
        this.props.handleOpenCheckInManually();
        this.pendding = false
      }else{
        console.log('thu lai')
        this.pendding = false
      }


    } else {
      // alert(`Tim thay doi tuong ${indices} voi probability ${values}`);
      this.props.handleCheckInAutoSuccess(indices);
      this.pendding = false;
    }
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
