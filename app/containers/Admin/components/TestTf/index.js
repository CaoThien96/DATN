import React, { Component } from 'react';
import { askForPermissioToReceiveNotifications } from 'push-notification';
import { Badge } from 'antd';
import notification from 'antd/es/notification';
import Avatar from 'antd/es/avatar';
import Button from 'antd/lib/button/button';
import commonFirebase from 'containers/Admin/common';
import Img from './bbt4.jpg'
import { drawDetections } from '../Checker/common/drawing';
import adminCommon from '../../common';

class Index extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef()
    this.inputReview = React.createRef()
    this.canvasRef = React.createRef()
    this.videoTag = React.createRef()
    this.canvasClone = React.createRef()
  }
  async componentDidMount(){
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
  handleCropFace =async ()=>{
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize:224, scoreThreshold:0.5 })
    const detection = await faceapi.detectAllFaces(this.inputRef.current,options)
    drawDetections(this.inputRef.current, this.canvasRef.current, detection);
    const imageExtract = await faceapi.extractFaces(
      this.inputRef.current,
      detection,
    );

    console.log(this.inputReview)
    for (let i = 0; i < imageExtract.length; i++) {
      const imageToSquare = await faceapi.imageToSquare(
        imageExtract[i],
        150,
        true,
      );
      this.inputReview.current.append(imageToSquare)
    }
  }
  onPlay = async () => {
    if (
      !this.videoTag.current.currentTime ||
      this.videoTag.current.paused ||
      this.videoTag.current.ended ||
      !faceapi.nets.tinyFaceDetector.params
    )
      return setTimeout(() => this.onPlay(this.videoTag.current));
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize:224, scoreThreshold:0.5 })
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
      const imageExtract = await faceapi.extractFaces(
        this.videoTag.current,
        [result.alignedRect],
      );
      const imageToSquare = await faceapi.imageToSquare(
        imageExtract[0],
        150,
        true,
      );
      console.log(imageToSquare)
      const grayImage = adminCommon.getGrayImage(imageToSquare)
      this.inputReview.current.append(grayImage)
      console.log({imageToSquare,grayImage})
      drawDetections(this.videoTag.current, this.canvasRef.current, [
        result.alignedRect,
      ]);
      // const ctx = this.canvasRef.current.getContext('2d');
      // ctx.drawImage(grayImage,0,0)
    } else {
      drawDetections(this.videoTag.current, this.canvasRef.current, []);
    }
    setTimeout(() => this.onPlay(this.videoTag.current), 1000 / 40);
  };
  render() {
    return (
      <div>

      </div>

    );
  }
}

export default Index;
