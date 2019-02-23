import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Layer, Rect, Stage } from 'react-konva';
import * as PropTypes from 'prop-types';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Index from './index';
import { Text } from 'konva';

class TrainingWithVideoV2 extends Component {
  constructor(props) {
    super(props);
    this.sourceTag = React.createRef();
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    console.log({ acceptedFiles, rejectedFiles });
    this.sourceTag.current.src = URL.createObjectURL(acceptedFiles[0]);
    this.sourceTag.current.parentElement.load();
  };

  render() {
    const { videoTag, canvasTag,faceCropTag, faces } = this.props;
    return (
      <div>
        <Row>
          <Col span={12}>
            <Dropzone style={{ border: '1px dashed' }} onDrop={this.onDrop}>
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
            <div
              style={{ position: 'relative', width: '640px', height: '480px' }}
            >
              <video
                ref={videoTag}
                style={{ position: 'absolute' }}
                width={640}
                height={480}
                controls
              >
                <source src="mov_bbb.mp4" ref={this.sourceTag} />
                Your browser does not support HTML5 video.
              </video>
              <div style={{ position: 'absolute' }}>
                <Stage width={640} height={480}>
                  <Layer>
                    {faces &&
                      faces.map(({ x, y, width, height }) => {
                        console.log({ x, y, width, height });
                        return (
                          <Rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            stroke="green"
                          />
                        )
                      })}
                  </Layer>
                </Stage>
              </div>
            </div>
          </Col>
          {/*<Col>*/}
            {/*<div ref={faceCropTag}>*/}
              {/*{this.props.faceCrop &&*/}
              {/*this.props.faceCrop.map(face => (*/}
                {/*<img src={face} alt="" />*/}
              {/*))}*/}
            {/*</div>*/}
          {/*</Col>*/}
        </Row>
      </div>
    );
  }
}
TrainingWithVideoV2.defaultProps = {};
TrainingWithVideoV2.propTypes = {
  faces: PropTypes.array.isRequired,
};
export default TrainingWithVideoV2;
