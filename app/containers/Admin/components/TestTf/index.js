import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { getFaceDetectorOptions } from '../Checker/common/faceDetectionControls';
class App extends Component {
  constructor(props) {
    super(props);
    this.stream = null;
    this.videoTag = React.createRef();
    this.state = { images: [] };
  }

  componentDidMount() {}

  onTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }

  onCameraError(error) {
    console.error('onCameraError', error);
  }

  onCameraStart(stream) {
    this.stream = stream;
    this.videoTag.current.srcObject = stream;
  }

  handleDetected = async () => {
    const options = getFaceDetectorOptions();
    if (this.videoTag.current !== null) {
      const result = await faceapi.detectSingleFace(
        this.videoTag.current,
        options,
      );
      if (result) {
        this.setState(prevState => {
          let newImage = prevState.images;
          newImage = [...newImage, 1];
          console.log({ newImage });
          return {
            images: newImage,
          };
        });
        console.log(this.state.images);
      }
    }
  };

  onPlay = () => {
    this.setState(prevState => {
      let newImage = prevState.images;
      newImage = [...newImage, 1];
      console.log({ newImage });
      return {
        images: newImage,
      };
    });
    console.log(this.state.images);
    // setInterval(() => {
    //   this.handleDetected();
    // }, 1000 / 20);
  };

  onCameraStop() {
    console.log('onCameraStop');
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.onPlay}>Bat dau tracking</button>
        <video
          // style={{ position: 'absolute' }}
          // onPlay={this.onPlay}
          ref={this.videoTag}
          width="594"
          height="383"
          controls
          autoPlay
          muted
        />
        <Camera
          onTakePhoto={dataUri => {
            this.onTakePhoto(dataUri);
          }}
          onCameraError={error => {
            this.onCameraError(error);
          }}
          idealFacingMode={FACING_MODES.ENVIRONMENT}
          idealResolution={{ width: 640, height: 480 }}
          imageType={IMAGE_TYPES.JPG}
          imageCompression={0.97}
          isMaxResolution={false}
          isImageMirror={false}
          isFullscreen={false}
          isDisplayStartCameraError
          sizeFactor={1}
          onCameraStart={stream => {
            this.onCameraStart(stream);
          }}
          onCameraStop={() => {
            this.onCameraStop();
          }}
        />
      </div>
    );
  }
}

export default App;
