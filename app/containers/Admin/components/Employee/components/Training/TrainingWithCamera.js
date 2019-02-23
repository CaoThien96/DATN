import React, { Component } from 'react';
import Col from 'antd/es/grid/col';
import { Layer, Rect, Stage } from 'react-konva';
import Row from 'antd/es/grid/row';

class TrainingWithCamera extends Component {
  render() {
    const { videoTag, faces } = this.props;
    return (
      <div>
        <Row>
          <Col span={12}>
            <div
              style={{ position: 'relative', width: '640px', height: '480px' }}
            >
              <video
                style={{ position: 'absolute' }}
                width="640"
                onLoad={() => console.log('load sucess')}
                // onPlay={this.onPlay}
                height="480"
                // controls
                autoPlay
                ref={videoTag}
              />
              <div style={{ position: 'absolute' }}>
                <Stage width={640} height={480}>
                  <Layer>
                    {faces &&
                      faces.map(({ x, y, width, height }) => (
                        <Rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          stroke="green"
                        />
                      ))}
                  </Layer>
                </Stage>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TrainingWithCamera;
