import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import Camera from './Camera';
import Video from './Video';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import ImageAttendance from './Image';
class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: false,
      faceMatcher: undefined,
      users: [],
    };
  }

  componentWillMount() {
    request('/api/employee').then(data => {
      this.setState({ users: data });
      const labelDesciptors = data.filter(el => {
        if (el.training) {
          return true;
        }
        return false;
      });
      const resultRef = labelDesciptors.map(labelDesciptor => {
        const training = JSON.parse(labelDesciptor.training);
        const descriptors = training._descriptors.map(
          el => new Float32Array(Object.values(el)),
        );
        const tmp = new faceapi.LabeledFaceDescriptors(
          labelDesciptor.iid.toString(),
          descriptors,
        );
        return tmp;
      });
      const faceMatcher = new faceapi.FaceMatcher(resultRef, 0.55);
      this.setState({ user: data.payload, faceMatcher, faceMatcher });
    });
  }

  handleTrainingModel = () => {};

  render() {
    return (
      <div>
        {this.state.faceMatcher ? (
          <div>
            <Row>
              <Col span={2}>
                <Button onClick={() => this.setState({ camera: true })}>
                  Camera
                </Button>
              </Col>
              <Col span={2}>
                <Button onClick={() => this.setState({ camera: false })}>
                  Video
                </Button>
              </Col>

              <Col span={2}>
                <Button onClick={this.handleCreateModel}>Training Model</Button>
              </Col>
            </Row>
            {this.state.camera ? (
              <Camera faceMatcher={this.state.faceMatcher} />
            ) : (
              <ImageAttendance />
            )}
          </div>
        ) : (
          <LoadingIndicator />
        )}
      </div>
    );
  }
}

export default Media;
