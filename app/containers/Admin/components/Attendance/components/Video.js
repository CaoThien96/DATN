import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Layer, Rect, Stage } from 'react-konva';
import Button from 'antd/es/button/button';

class Video extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.sourceTag = React.createRef();
    this.state = {
      faces: [],
      options: undefined,
      interval: undefined,
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(this.sourceTag);
    // Do something with files
    console.log({ acceptedFiles, rejectedFiles });
    this.sourceTag.current.src = URL.createObjectURL(acceptedFiles[0]);
    this.sourceTag.current.parentElement.load();
  };

  componentDidMount() {
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
        // console.log(resultsQuery)
        console.log(
          this.props.faceMatcher
            .findBestMatch(resultsQuery.descriptor)

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
    if(this.videoTag.current.ended){
      clearInterval(this.state.interval);
      this.setState({
        interval: undefined,
      });
    }
    if (this.videoTag.current.paused) {
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }
      this.videoTag.current.play();
      this.setState({
        interval: setInterval(this.grabFrame, 1000 / 24),
      });
    } else {
      console.log('pause')
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
        Video
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              style={{
                height: '100px',
                border: '2px dashed #666',
                borderRadius: '5px',
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : (
                <p>
                  Try dropping some files here, or click to select files to
                  upload.
                </p>
              )}
            </div>
          )}
        </Dropzone>
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
          <video
            style={{ position: 'absolute' }}
            ref={this.videoTag}
            width="640"
            height="480"
            controls
          >
            <source src="mov_bbb.mp4" ref={this.sourceTag} />
            Your browser does not support HTML5 video.
          </video>
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
          <Button  onClick={this.handleTracking}>Start regornize</Button>
        </div>
      </div>
    );
  }
}

export default Video;
