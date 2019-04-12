import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import message from 'antd/es/message'
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Divider from 'antd/es/divider';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Button from 'antd/es/button/button';
import Camera from './component/Camera';
import Result from './component/Result';
import CheckInManual from './component/CheckInManual/index';
import injectReducer from '../../../../utils/injectReducer';
import reducer from './reducer';

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
      model:false
    };
  }

  async componentDidMount() {
    console.log({dasd:'dasdasda'})
    try {
      const model = await tf.loadModel(
        'http://localhost:3000/model/model.json',
      );
      this.setState({model})
      message.success('Tải mô hình thành công');
    }catch (e) {
      console.log(e)
      message.error('Tải mô hình thất bại')
    }

  }
  onSuccessFindObject = infor => {};

  onCheckInManualSuccess = () => {
    this.setState({
      checkInManual: false,
    });
  };

  onOpenCheckInManual = () => {
    this.setState({
      checkInManual: true,
    });
  };

  onCloseCheckInManual = () => {
    this.setState({
      checkInManual: false,
    });
  };

  render() {
    const { listCheckIn, checkInManual } = this.state;
    return (
      <Row>
        <CheckInManual
          onCloseCheckInManual={this.onCloseCheckInManual}
          checkInManual={checkInManual}
          onCheckInManualSuccess={this.onCheckInManualSuccess}
        />
        <Col
          style={{ borderRight: '1px solid', height: '-webkit-fill-available' }}
          span={13}
        >
          <h2 className="text-center">Camera</h2>
          <Divider />
          <div>
            <Button onClick={this.onOpenCheckInManual}>CheckInManual</Button>
          </div>
          <Camera model={this.state.model} />
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
const withReducer = injectReducer({ key: 'checker', reducer });
export default withRouter(compose(withReducer)(LayoutChecker));
