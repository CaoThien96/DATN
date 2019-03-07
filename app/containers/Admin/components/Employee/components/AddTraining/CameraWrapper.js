import React, { Component } from 'react';
import styled from 'styled-components';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import TrainingImage from '../../../Attendance/components/bbt3.jpg';
import { getFaceDetectorOptions } from '../../../Checker/common/faceDetectionControls';
import { drawDetections } from '../../../Checker/common/drawing';
import Test from './Test';
const ButtonTry = styled.div`
  position: relative;
  text-align: center;
  top: 400px;
  display: block;
`;

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
    this.resultTag = React.createRef();
    this.images = [];
    this.imagesExtract = [];
    this.status = 'un-previewed';
    this.state = {
      status: 'un-previewed',
      images: [],
    };
  }

  componentWillUnmount() {
    console.log('remove');
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks()[0].stop();
    }
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.setState({
      localStream: stream,
    });
    this.videoTag.current.srcObject = stream;
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
    const result = await faceapi.detectSingleFace(
      this.videoTag.current,
      options,
    );
    if (result) {
      if (this.images.length < 100) {
        const tmp = this.images;
        const imageExtract = await faceapi.extractFaces(this.videoTag.current,[result]);
        tmp.push(imageExtract[0]);
        this.images = tmp;
        console.log(this.images);
        // const images = this.state.images.push(result);
        // console.log(images);
        // this.setState({images})
      } else if (this.status == 'un-previewed') {
        // const images = await faceapi.extractFaces(
        //   this.videoTag.current,
        //   this.images,
        // );
        // this.imagesExtract = images;
        this.props.onDetectedFaceSuccess(this.images);
        this.status = 'previewed';
        this.setState({
          status: 'previewed',
        });
      }
      drawDetections(this.imageTag.current, this.canvasRef.current, [result]);
    } else {
      drawDetections(this.imageTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current), 1000 / 15);
  };

  onReTraining = () => {
    this.setState({
      status: 'un-previewed',
    });
    this.images = [];
    this.status = 'un-previewed';
    this.props.onTryDetectedFace();
  };

  onSave = async () => {
    console.log(this.props);
    this.props.history.replace('/admin/employee');
    const descriptors = this.imagesExtract.map(
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
        request('/api/employee', {
          method: 'PUT', // or 'PUT'
          body: JSON.stringify({
            id: this.props.params.id,
            data,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(data => {});
      })
      .catch(e => console.log({ e }));
  };

  render() {
    const { images } = this.state;
    return (
      <div>
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
        </ButtonTry>
      </div>
    );
  }
}

export default CameraWrapper;
