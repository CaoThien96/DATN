import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Divider from 'antd/es/divider';
import Camera from './component/Camera';
import Result from './component/Result';

class LayoutChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCheckIn: [],
    };
  }

  onSuccessFindObject = infor => {};

  render() {
    return (
      <Row>
        <Col
          style={{ borderRight: '1px solid', height: '-webkit-fill-available' }}
          span={13}
        >
          <h2 className="text-center">Camera</h2>
          <Divider />
          <Camera />
        </Col>
        <Col style={{ height: '-webkit-fill-available' }} span={11}>
          <h2 className="text-center">Thông tin giám sát ngày 4/3/2019</h2>
          <Divider />
          <Result listCheckIn={[]} />
        </Col>
      </Row>
    );
  }
}

LayoutChecker.defaultProps = {};
LayoutChecker.propTypes = {};

export default LayoutChecker;
