import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Button from 'antd/es/button/button';
import Radio from 'antd/es/radio/radio';
import RadioGroup from 'antd/es/radio/group';
import * as _ from 'lodash';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectRepos,
  makeSelectShowLoading,
} from 'containers/App/selectors';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { compose } from 'redux';
import Guild from './Guild';
import Training from './Training';
import TrainingWithVideo from './TrainingWithVideo';
import TrainingWithVideoV2 from './TrainingWithVideoV2';
import request from '../../../../../../utils/request';
import TrainingWithImage from './TrainingWithImage';
import { handleCropFace } from './common/index';
import lodash_commons from '../../../../../commons/lodash_commons';
import TrainingWithCamera from './TrainingWithCamera';
import { makeSelectUsername } from '../../../../../HomePage/selectors';
import { HomePage, mapDispatchToProps } from '../../../../../HomePage';
import injectReducer from '../../../../../../utils/injectReducer';
import reducer from '../../../../../HomePage/reducer';
class Index extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.sourceTag = React.createRef();
    this.faceCropTag = React.createRef();
    this.listImageTmp = React.createRef();
    this.listImageUpload = React.createRef();
    this.state = {
      typeTraining: 'video',
      faces: [],
      ctx: undefined,
      inputSize: 256,
      faceDetection: [],
      imgCrop: [],
      faceCrop: [],
      tinyOptions: undefined,
      interval: undefined,
      localStream: undefined,
    };
  }

  componentDidMount() {
    // this.handleNewStream();
    const inputSize = 256;
    const scoreThreshold = 0.5;
    const ctx = this.canvasTag.current.getContext('2d');
    this.setState({
      ctx,
      tinyOptions: new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold,
      }),
    });
  }

  componentWillUnmount() {
    // this.handeStopStream();
  }

  handleNewStream = () =>
    new Promise(resolve => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.setState({
            localStream: stream,
          });
          this.videoTag.current.srcObject = stream;
          resolve(stream);
        })
        .catch(console.log);
    });

  handleSaveTraining = async () => {
    const labelFaceDetector = await this.handleExtractFeatureV2();
    console.log(labelFaceDetector);
    request('/api/employee', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify({
        id: this.props.match.params.id,
        labelFaceDetector,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        while (this.listImageTmp.current.hasChildNodes()) {
          this.listImageTmp.current.removeChild(
            this.listImageTmp.current.lastChild,
          );
        }
        this.setState({
          faces: [],
          faceDetection: [],
          faceCrop: [],
        });
        alert(JSON.stringify(res));
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  };

  handleDetectFace = async () => {
    if (this.videoTag.current.ended || this.state.faceDetection.length > 10) {
      console.log('Da thu thap du');
      this.handleCropFace();
      clearInterval(this.state.interval);
      // this.handeStopStream();
      return;
    }
    this.state.ctx.drawImage(this.videoTag.current, 0, 0, 640, 480);
    const dataUrl = this.canvasTag.current.toDataURL();
    const faceDetectionTask = await faceapi
      .detectSingleFace(this.canvasTag.current, this.state.tinyOptions)
      .withFaceLandmarks();
    if (faceDetectionTask) {
      const tmpBox = faceDetectionTask.alignedRect.box;
      console.log(faceDetectionTask);
      this.setState({
        faces: [tmpBox],
      });
      if (1) {
        this.setState(prevState => {
          const faceDetection = [
            ...prevState.faceDetection,
            { box: tmpBox, dataUrl, detection: faceDetectionTask.alignedRect },
          ];
          return {
            faceDetection,
          };
        });
      } else {
        console.log('Da thu thap du');
        console.log({ tmpBox });
      }
    }
  };

  // Bat dau training
  handleTraining = () => {
    if (this.state.faceDetection.length) {
      console.log('Training lai');
      while (this.listImageTmp.current.hasChildNodes()) {
        this.listImageTmp.current.removeChild(
          this.listImageTmp.current.lastChild,
        );
      }
      this.setState({
        faces: [],
        faceDetection: [],
        faceCrop: [],
      });
    }
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    if (this.state.typeTraining == 'video') {
      this.videoTag.current.play();
    }
    this.setState({
      interval: setInterval(this.handleDetectFace, 1000 / 20),
    });
  };

  handleStopTraining = () => {
    clearInterval(this.state.interval);
  };

  // Cat cac khuon mat ra
  handleCropFace = async () => {
    switch (this.state.typeTraining) {
      case 'camera':
        const tmp1 = this.state.faceDetection.map(
          async ({ box, dataUrl, detection }) => {
            const tmpCanvas = await faceapi.fetchImage(dataUrl);
            const face = await faceapi.extractFaces(tmpCanvas, [detection]);
            this.listImageTmp.current.appendChild(face[0]);
            return face[0];
          },
        );
        // Promise.all(tmp1).then(data => {
        //   this.setState(prevState => ({
        //     faceCrop: [...prevState.faceCrop, data],
        //   }));
        // });
        break;
      case 'video':
        const tmp = this.state.faceDetection.map(
          async ({ box, dataUrl, detection }) => {
            const tmpCanvas = await faceapi.fetchImage(dataUrl);
            const face = await faceapi.extractFaces(tmpCanvas, [detection]);
            this.listImageTmp.current.appendChild(face[0]);
            return face[0];
          },
        );
        // Promise.all(tmp).then(data => {
        //   this.setState(prevState => ({
        //     faceCrop: [...prevState.faceCrop, data],
        //   }));
        // });
        break;
      default:
        console.log(this.listImageUpload);
        const faceCrop = await handleCropFace(
          this.listImageUpload.current.children,
          this.state.tinyOptions,
          faceapi,
          this.state.typeTraining,
        );
        for (let i = 0; i < faceCrop.length; i++) {
          faceCrop[i]
            .then(data => {
              this.listImageTmp.current.appendChild(data.faceHtml);
            })
            .catch(ee => console.log(ee));
        }
        break;
    }
  };

  handleExtractFeatureV2 = async () =>
    new Promise(resolve => {
      const extractFeatureTask = lodash_commons.lodashMap(
        this.listImageTmp.current.children,
        async image => {
          const tmp = await faceapi.computeFaceDescriptor(image);
          return tmp;
        },
      );
      Promise.all(extractFeatureTask)
        .then(data => {
          const labelFaceDescriptor = new faceapi.LabeledFaceDescriptors(
            this.props.match.params.id,
            data,
          );
          return resolve(labelFaceDescriptor);
        })
        .catch(err => console.log(err));
    });

  handleChangeInputSize = e => {
    this.setState({
      inputSize: parseInt(e.target.value),
      tinyOptions: new faceapi.TinyFaceDetectorOptions({
        inputSize: e.target.value,
        scoreThreshold: 0.5,
      }),
    });
  };

  handleChangeTraining = typeTraining => {
    switch (typeTraining) {
      case 'camera':
        this.setState({
          typeTraining: 'camera',
        });
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(stream => {
            this.setState({
              localStream: stream,
            });
            return (this.videoTag.current.srcObject = stream);
          })
          .catch(console.log);
        break;
      case 'video':
        this.setState({ typeTraining: 'video' });
        console.log(this.state);
        this.handleStopStream();
        break;
      default:
        this.setState({ typeTraining: 'image' });
        if (this.state.localStream) {
          this.handleStopStream();
        }
        break;
    }
  };

  handleStopStream = () => {
    this.state.localStream.getVideoTracks()[0].stop();
  };

  render() {
    const { faces, inputSize, faceCrop,showLoading } = this.state;
    console.log(showLoading);
    return (
      <div>
        {/* {this.props.match.params.id} */}
        <Row>
          <RadioGroup onChange={this.handleChangeInputSize} value={inputSize}>
            <Radio value={128}>128</Radio>
            <Radio value={256}>256</Radio>
            <Radio value={512}>512</Radio>
          </RadioGroup>
        </Row>
        <Row>
          <Col span={2}>
            <Button onClick={() => this.handleChangeTraining('camera')}>
              Camera
            </Button>
          </Col>
          <Col span={2}>
            <Button onClick={() => this.handleChangeTraining('video')}>
              Video
            </Button>
          </Col>
          <Col span={2}>
            <Button onClick={() => this.handleChangeTraining('image')}>
              Image
            </Button>
          </Col>
        </Row>

        <canvas
          style={{ display: 'none' }}
          // style={{ position: 'absolute' }}
          width="640"
          height="480"
          ref={this.canvasTag}
        />
        {this.state.typeTraining == 'camera' ? (
          <Row>
            <Col span={24}>
              <TrainingWithCamera faces={faces} videoTag={this.videoTag} />
            </Col>
          </Row>
        ) : this.state.typeTraining == 'video' ? (
          <Row>
            <Col span={24}>
              {/* <TrainingWithVideo/> */}
              <TrainingWithVideoV2
                faces={faces}
                videoTag={this.videoTag}
                canvasTag={this.canvasTag}
                faceCropTag={this.faceCropTag}
                sourceTag={this.sourceTag}
                faceCrop={this.state.imgCrop}
              />
            </Col>
          </Row>
        ) : (
          <TrainingWithImage
            listImageUploadTag={this.listImageUpload}
            faceCrop={[]}
          />
        )}
        <Row>
          <Button type="primary" onClick={this.handleTraining}>
            Bắt đầu tách mặt
          </Button>
          <Button type="primary" onClick={this.handleStopTraining}>
            Dừng tách mặt
          </Button>
          {/* <Button type="primary" onClick={this.handleCropFace}> */}
          {/* Show Faces */}
          {/* </Button> */}
          <Button type="primary" onClick={this.handleSaveTraining}>
            Lưu dữ liệu
          </Button>
        </Row>
        <div id="result-image-crop-align" ref={this.listImageTmp} />
      </div>
    );
  }
}

Index.defaultProps = {};
Index.propTypes = {};
const mapStateToProps = createStructuredSelector({
  showLoading: makeSelectShowLoading(),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'home', reducer });
export default compose(
  withReducer,
  withConnect,
)(Index);
