import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Divider from 'antd/es/divider';
import Camera from './component/Camera';
import Result from './component/Result';
import CheckInManual from './component/CheckInManual/index';

class LayoutChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listCheckIn: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(el => ({
        id: el,
        user: {
          fullName: 'Cao Van Thien',
        },
        time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
      })),
      checkInManual: false,
    };
  }

  onSuccessFindObject = infor => {};
  onCheckInManualSuccess = ()=>{
    this.setState({
      checkInManual: false,
    })
  }
  render() {
    const { listCheckIn, checkInManual } = this.state;
    return checkInManual ? (
      <CheckInManual checkInManual={checkInManual} onCheckInManualSuccess={this.onCheckInManualSuccess} />
    ) : (
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
          <Result listCheckIn={listCheckIn} />
        </Col>
      </Row>
    );
  }
}

LayoutChecker.defaultProps = {};
LayoutChecker.propTypes = {};

export default LayoutChecker;
