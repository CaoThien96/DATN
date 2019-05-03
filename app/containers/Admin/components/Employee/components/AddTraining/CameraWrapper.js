import React, { Component } from 'react';
import styled from 'styled-components';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import { showLoading, hiddenLoading } from 'containers/App/actions';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import * as _ from 'lodash';
import connect from 'react-redux/es/connect/connect';
import adminCommon from 'containers/Admin/common';
import TrainingImage from '../../../Attendance/components/bbt3.jpg';
import { getFaceDetectorOptions } from '../../../Checker/common/faceDetectionControls';
import { drawDetections } from '../../../Checker/common/drawing';
import { makeSelectCurrentUser } from '../../../../../App/selectors';
const ButtonTry = styled.div`
  position: relative;
  text-align: center;
  display: block;
`;

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
    this.canvasRef = React.createRef();
    this.canvasClone = React.createRef();
    this.resultTag = React.createRef();
    this.images = [];
    this.status = 'un-previewed';
    this.state = {
      status: 'un-previewed', // un-previewed chua tao du || previewed tao du
      statusTraining: 0, // If status = 0 is create manual else create auto
      countImage: 0,
    };
  }

  componentWillUnmount() {
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks()[0].stop();
    }
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        // facingMode:'environment'
      },
    });
    this.setState({
      localStream: stream,
    });
    this.videoTag.current.srcObject = stream;
    this.canvasClone.current.width = this.videoTag.current.width;
    this.canvasClone.current.height = this.videoTag.current.height;
  }

  onPlay = async () => {
    const { statusTraining } = this.state;
    if (
      !this.videoTag.current.currentTime ||
      this.videoTag.current.paused ||
      this.videoTag.current.ended ||
      !faceapi.nets.tinyFaceDetector.params
    )
      return setTimeout(() => this.onPlay(this.videoTag.current));
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.5,
    });
    const canvasClone = this.canvasClone.current.getContext('2d');
    canvasClone.drawImage(
      this.videoTag.current,
      0,
      0,
      this.videoTag.current.width,
      this.videoTag.current.height,
    );
    const result = await faceapi
      .detectSingleFace(this.canvasClone.current, options)
      .withFaceLandmarks();
    if (result) {
      if (statusTraining == 1 && result.detection.score > 0.85) {
        if (this.images.length < 36) {
          const tmp = this.images;
          const imageExtract = await faceapi.extractFaces(
            this.videoTag.current,
            [result.alignedRect],
          );
          const imageToSquare = await faceapi.imageToSquare(
            imageExtract[0],
            64,
            true,
          );
          console.log(imageToSquare);
          const grayImage = adminCommon.getGrayImage(imageToSquare);
          console.log({ imageToSquare, grayImage });
          tmp.push(grayImage);
          this.images = tmp;
          this.setState({ countImage: this.images.length });
        } else if (this.status == 'un-previewed') {
          this.props.onDetectedFaceSuccess(this.images);
          this.status = 'previewed';
          this.setState({
            status: 'previewed',
          });
        }
      }
      drawDetections(this.videoTag.current, this.canvasRef.current, [
        result.alignedRect,
      ]);
    } else {
      drawDetections(this.videoTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current), 1000 / 40);
  };

  onReTraining = () => {
    this.setState({
      status: 'un-previewed',
      statusTraining: 0,
    });
    this.images = [];
    this.status = 'un-previewed';
    this.props.onTryDetectedFace();
  };

  onCreateTrainingManual = async () => {
    this.buttonPressTimer = setInterval(async () => {
      console.log('onCreateTrainingManual');
      const options = getFaceDetectorOptions();
      const canvasClone = this.canvasClone.current.getContext('2d');
      canvasClone.drawImage(
        this.videoTag.current,
        0,
        0,
        this.videoTag.current.width,
        this.videoTag.current.height,
      );
      const result = await faceapi
        .detectSingleFace(this.canvasClone.current, options)
        .withFaceLandmarks();
      if (result) {
        if (this.images.length < 36) {
          const tmp = this.images;
          const imageExtract = await faceapi.extractFaces(
            this.videoTag.current,
            [result.alignedRect],
          );
          const imageToSquare = await faceapi.imageToSquare(
            imageExtract[0],
            64,
            true,
          );
          const grayImage = adminCommon.getGrayImage(imageToSquare);
          tmp.push(grayImage);
          this.images = tmp;
          this.setState({ countImage: this.images.length });
        } else if (this.status == 'un-previewed') {
          this.props.onDetectedFaceSuccess(this.images);
          this.handleButtonRelease();
          this.status = 'previewed';
          this.setState({
            status: 'previewed',
          });
        }
      }
    }, 1000 / 20);
  };

  handleButtonRelease = () => {
    clearTimeout(this.buttonPressTimer);
  };

  onSave = async () => {
    this.props.showLoading();
    console.log(this.props.params.id);
    setTimeout(() => {
      adminCommon.saveImage(this.images, this.props.params.id);
      const descriptors = this.images.map(
        el =>
          new Promise(async (resolve, reject) => {
            try {
              const tmp = await faceapi.computeFaceDescriptor(el);
              resolve(tmp);
            } catch (e) {
              reject(e);
            }
          }),
      );
      Promise.all(descriptors)
        .then(data => {
          console.log('goi qpi save');
          const customData = {
            _label: this.props.params.id,
            _descriptors: data,
          };
          request('/api/employee', {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify({
              id: this.props.params.id,
              data: customData,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(data => {
            this.props.hiddenLoading();
            this.props.history.replace('/admin/employee');
          });
        })
        .catch(e => {
          this.props.hiddenLoading();
          alert('Some things errors! Please retraining');
        });
    }, 100);
  };

  render() {
    return (
      <div>
        <DivWrapper>
          <canvas ref={this.canvasClone} style={{ display: 'none' }} />
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
        <ButtonTry>
          <Button type="primary" onClick={this.onReTraining}>
            Tạo lại
          </Button>
          <Button
            className="m-l-15"
            type="primary"
            disabled={this.state.status === 'un-previewed'}
            onClick={this.onSave}
          >
            Lưu
          </Button>
          <Button
            className="m-l-15"
            disabled={
              this.state.statusTraining === 1 ||
              this.state.status === 'previewed'
            }
            type="primary"
            onClick={() => this.setState({ statusTraining: 1 })}
          >
            Tạo Tự Động
            {` (${this.state.countImage} ảnh)`}
          </Button>
          <Button
            onTouchStart={this.onCreateTrainingManual}
            onTouchEnd={this.handleButtonRelease}
            onMouseDown={this.onCreateTrainingManual}
            onMouseUp={this.handleButtonRelease}
            onMouseLeave={this.handleButtonRelease}
            disabled={this.state.status === 'previewed'}
            className="m-l-15"
            type="primary"
          >
            Tạo Thủ Công
            {` (${this.state.countImage} ảnh)`}
          </Button>
        </ButtonTry>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});
const mapDispatchToProps = dispatch => ({
  showLoading: () => dispatch(showLoading()),
  hiddenLoading: () => dispatch(hiddenLoading()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(CameraWrapper));
