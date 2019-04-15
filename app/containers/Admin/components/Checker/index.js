import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import message from 'antd/es/message';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Divider from 'antd/es/divider';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import Camera from './component/Camera';
import Result from './component/Result';
import CheckInManual from './component/CheckInManual/index';
import injectReducer from '../../../../utils/injectReducer';
import reducer from './reducer';
import { makeSelectCurrentUser } from '../../../App/selectors';
import {
  makeSelectObject,
  makeSelectPending,
  makeSelectPredict,
} from './seclectors';
import { onPredict, onPredictResult } from './actions';
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
      model: false,
      users: [],
    };
  }

  async componentDidMount() {
    try {
      const model = await tf.loadModel(
        'http://localhost:3000/model/model.json',
      );
      const params = JSON.stringify({
        training: 1,
      });
      const users = await request(`/api/employee?value=${params}`);
      console.log({ users });
      this.setState({ model, users });

      message.success('Tải mô hình thành công');
    } catch (e) {
      console.log(e);
      message.error('Tải mô hình thất bại');
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

  handleCheckInAutoSuccess = indices => {
    const userPredict = this.state.users[indices];
    console.log({ userPredict });
    this.props.onPredict(userPredict)
  };

  render() {
    const { listCheckIn, checkInManual } = this.state;
    const currentDate = new Date();
    const stringDate= `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
    return (
      <Row>
        <CheckInManual
          onCloseCheckInManual={this.onCloseCheckInManual}
          checkInManual={checkInManual}
          onCheckInManualSuccess={this.onCheckInManualSuccess}
        />
        <Col
          style={{ borderRight: '1px solid', height: '-webkit-fill-available' }}
          span={12}
        >
          <h2 className="text-center">Camera</h2>
          <Divider />
          <div className='text-center'>
            <Button type={'danger'} onClick={this.onOpenCheckInManual}>{'Giám sát thủ công'}</Button>
          </div>
          <Camera
            checkInManual={checkInManual}
            model={this.state.model}
            handleCheckInAutoSuccess={this.handleCheckInAutoSuccess}
            handleOpenCheckInManually={this.onOpenCheckInManual}
          />
        </Col>
        <Col style={{ height: '-webkit-fill-available' }} span={12}>
          <h2 className="text-center">Thông tin giám sát: {stringDate}</h2>
          <Divider />
          <Result listCheckIn={listCheckIn} />
        </Col>
      </Row>
    );
  }
}

LayoutChecker.defaultProps = {};
LayoutChecker.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});
const mapDispatchToProps = dispatch => ({
  onPredict: payload => dispatch(onPredict(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'checker', reducer });
export default withRouter(
  compose(
    withReducer,
    withConnect,
  )(LayoutChecker),
);
