import React, { Component } from 'react';
import styled from 'styled-components';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import TrainingImage from '../../Attendance/components/bbt3.jpg';
import { getFaceDetectorOptions } from '../common/faceDetectionControls';
import { drawDetections } from '../common/drawing';
import { onPredict } from '../actions';
import { makeSelectCurrentUser } from '../../../../App/selectors';
import {
  makeSelectObject,
  makeSelectPredict,
  makeSelectPending,
  makeSelectListCheckIn,
} from '../seclectors';
import adminCommon from '../../../common';

const DivWrapper = styled.div`
  position: relative;
  height: 480px;
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
    const options = getFaceDetectorOptions(0.6);
    const tmpHtmlMedia = faceapi.createCanvasFromMedia(this.videoTag.current);
    const result = await faceapi
      .detectSingleFace(tmpHtmlMedia, options)
      .withFaceLandmarks();
    if (result) {
      const alignedRect = result.alignedRect;
      const imageExtract = await faceapi.extractFaces(this.videoTag.current, [
        alignedRect,
      ]);
      const imageToSquare = await faceapi.imageToSquare(
        imageExtract[0],
        128,
        true,
      );
      const grayImage = adminCommon.getGrayImage(imageToSquare);
      const descriptor = await faceapi.computeFaceDescriptor(grayImage);
      const iid = this.props.faceMatch.findBestMatch(descriptor);
      const boxesWithText = new faceapi.BoxWithText(
        alignedRect.box,
        iid.toString(),
      );
      drawDetections(this.videoTag.current, this.canvasRef.current, []);
      faceapi.drawDetection(this.canvasRef.current, boxesWithText);
      // console.log({pendding:this.pendding,checkInManual:this.props.checkInManual})
      if (!this.pendding && !this.props.checkInManual) {
        this.pendding = true;
        const tmpIid = this.onRecognition({ descriptor });
        if (iid.label !== 'unknown') {
          if (tmpIid == parseInt(iid.label)) {
            console.log({ listChecKInV2: this.props.listCheckInV2 });
            const indexUser = this.props.listCheckInV2.findIndex(el => {
              if (tmpIid == el.user.iid) {
                return true;
              }
              return false;
            });
            console.log(indexUser);
            if (indexUser === -1) {
              this.onCheckInSuccessWithFaceMatcher(iid.label);
            }
          } else {
            console.log({ modelIid: tmpIid, matcherLabel: iid.label });
            console.log(`model va findbestmatch khong khop`);
          }
        } else {
          this.pendding = false;
        }
      }
      // drawDetections(this.videoTag.current, this.canvasRef.current, [
      //   alignedRect,
      // ]);
    } else {
      drawDetections(this.videoTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current));
  };

  onRecognition(result) {
    const tfDescriptor = tf.tensor2d(result.descriptor, [1, 128]);
    const yPredict = this.props.model.predict(tfDescriptor);
    let { values, indices } = tf.topk(yPredict);
    values = values.as1D().dataSync();
    indices = indices.as1D().dataSync();

    if (values < this.props.score) {
      this.miss = this.miss + 1;
      this.props.handleShowCurrentPredict(indices, values);
      // if (this.miss > 2) {
      //   this.props.handleOpenCheckInManually();
      //   this.pendding = false;
      // } else {
      //   console.log('thu lai');
      //   this.pendding = false;
      // }
      this.pendding = false;
      console.log({ values, indices });
      return null;
    }
    this.miss = 0;
    this.props.handleShowCurrentPredict(indices, values);
    if (this.props.usersOfModel) {
      // console.log(this.props.usersOfModel)
      const userPredict = this.props.usersOfModel[indices];
      this.pendding = false;
      return userPredict.iid;
    }

    // this.props.handleCheckInAutoSuccess(indices);
    this.pendding = false;
    // return userPredict.iid
    return null;
  }

  onCheckInSuccessWithFaceMatcher = iid => {
    this.props.handleCheckInAutoSuccessV2WithFaceMatcher(iid);
    this.pendding = false;
  };

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
          width="640"
          height="480"
          controls
          autoPlay
          muted
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
  listCheckInV2: makeSelectListCheckIn(),
});
const mapDispatchToProps = dispatch => ({
  onPredict: payload => dispatch(onPredict(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(CameraWrapper));
