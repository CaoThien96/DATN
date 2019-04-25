import React, { Component } from 'react';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import CameraWrapper from './CameraWrapper';
import Preview from './Preview';

class Index extends Component {
  constructor(props) {
    super(props);
    this.resultTag = React.createRef();
    this.state = {
      listFaceDetected: [],
    };
  }

  onDetectedFaceSuccess = listFaceDetected => {
    this.setState({
      listFaceDetected,
    });
  };

  onTryDetectedFace = () => {
    while (this.resultTag.current.hasChildNodes()) {
      this.resultTag.current.removeChild(this.resultTag.current.lastChild);
    }
  };

  render() {
    const { listFaceDetected } = this.state;
    const { params } = this.props.match;
    return (
      <div>
        <Row>
          <Col
            style={{
              borderRight: '1px solid',
              height: '-webkit-fill-available',
            }}
            xs={24}
            sm={24}
            md={24}
            xl={13}
          >
            <CameraWrapper
              {...this.props}
              params={params}
              onTryDetectedFace={this.onTryDetectedFace}
              onDetectedFaceSuccess={this.onDetectedFaceSuccess}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            style={{ height: '-webkit-fill-available' }}
            xl={11}
          >
            <Preview
              resultTag={this.resultTag}
              listFaceDetected={listFaceDetected}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Index;
