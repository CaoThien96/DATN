import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Button from 'antd/es/button/button';
import request from '../../../../../../utils/request';
class TrainingWithVideo extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.sourceTag = React.createRef();
    this.state = {
      options: undefined,
      ctx: undefined,
      interval: undefined,
      faces: undefined,
      descriptors: [],
    };
  }

  componentDidMount() {
    console.log(this.videoTag);
    const inputSize = 128;
    const scoreThreshold = 0.5;
    this.setState({
      options: new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      }),
    });
  }
  componentWillUnmount(){
  }
  handleSaveTrainingData = () => {
    const labelFaceDetector = new faceapi.LabeledFaceDescriptors(
      this.props.match.params.id,
      this.state.descriptors,
    );
    request('/api/employee', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({ id: this.props.match.params.id, labelFaceDetector }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {})
      .catch(err => {
        alert(JSON.stringify(err));
      });
  };
  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(this.sourceTag);
    // Do something with files
    console.log({ acceptedFiles, rejectedFiles });
    this.sourceTag.current.src = URL.createObjectURL(acceptedFiles[0]);
    this.sourceTag.current.parentElement.load();
  };

  grabFrame = async () => {
    try {
      const faceDetectionTask = await faceapi
        .detectAllFaces(this.videoTag.current, this.state.options)
        .withFaceLandmarks()
        .withFaceDescriptors();
      // const face = await faceDetectionTask.withFaceDescriptors();

      if (faceDetectionTask.length) {
        const tmp = this.state.descriptors;
        const descriptors = faceDetectionTask.map(({ descriptor }) => {
          tmp.push(descriptor);
          return descriptor;
        });
        this.setState(prevState => ({
          descriptors: tmp,
        }));
      }
    } catch (e) {
      console.log(e);
    }
    // const des = await faceDetectionTask
    //   .withFaceLandmarks();
    //   .withFaceDescriptors();
  };

  handleTraining = () => {
    if (this.videoTag.current.paused) {
      if (this.state.interval) {
        clearInterval(this.state.interval);
      }
      this.videoTag.current.play();
      this.setState({
        interval: setInterval(this.grabFrame, 1000 / 24),
      });
    } else {
      clearInterval(this.state.interval);
      this.setState({
        interval: undefined,
      });
      this.videoTag.current.pause();
    }
  };

  render() {
    return (
      <div>
        {/*<p>{this.props.match.params.id}</p>*/}
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()}>
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
        <video  ref={this.videoTag} width={640} height={480} controls>
          <source src="mov_bbb.mp4" ref={this.sourceTag} />
          Your browser does not support HTML5 video.
        </video>
        <div>
          <Button onClick={this.handleTraining} type="primary">
            Start Training
          </Button>
          <Button onClick={this.handleSaveTrainingData} type="primary">
            Save training
          </Button>

        </div>
      </div>
    );
  }
}

export default TrainingWithVideo;
