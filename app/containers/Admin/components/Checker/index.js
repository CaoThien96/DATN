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
import { updateModel } from 'containers/App/actions';
import Camera from './component/Camera';
import Result from './component/Result';
import CheckInManual from './component/CheckInManual/index';
import injectReducer from '../../../../utils/injectReducer';
import reducer from './reducer';
import { onPredict } from './actions';
import {
  makeSelectCurrentUser,
  makeSelectModel,
  makeSelectShouldUpdateModel,
  makeSelectUsersOfModel,
} from '../../../App/selectors';
class LayoutChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkInManual: false,
      curentPredict:false,
    };
  }

  async componentDidMount() {
    try {
      const model = await tf.loadModel(
        'http://localhost:3000/model2/model.json',
      );
      const params = JSON.stringify({
        training: 1,
      });
      const users = await request(`/api/employee?value=${params}`);
      this.setState({ model, users });
      this.props.updateModel({ model, users });
      message.success('Tải mô hình thành công');
    } catch (e) {
      console.log(e);
      message.error('Tải mô hình thất bại');
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.shouldUpdateModel) {
      const model = await tf.loadModel(
        'http://localhost:3000/model/model.json',
      );
      const params = JSON.stringify({
        training: 1,
      });
      const users = await request(`/api/employee?value=${params}`);
      console.log('Da cap nhat model');
      this.props.updateModel({ model, users });
    }
  }

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
  handleShowCurrentPredict = (indices,value)=>{
    if (this.props.usersOfModel) {
      // console.log(this.props.usersOfModel)
      const userPredict = this.props.usersOfModel[indices];
      this.setState({
        currentPredict : {
          userPredict,
          value
        }
      })
      /**
       * Gui event bao da tim thay mot doi tuong moi co xac suat okie! Va hay cap nhat trang thai checkin cho doi tuong nay di!!!
       */
    }
  }
  handleCheckInAutoSuccess = indices => {
    if (this.props.usersOfModel) {
      // console.log(this.props.usersOfModel)
      const userPredict = this.props.usersOfModel[indices];
      console.log({ userPredict });
      /**
       * Gui event bao da tim thay mot doi tuong moi co xac suat okie! Va hay cap nhat trang thai checkin cho doi tuong nay di!!!
       */
      this.props.onPredict(userPredict);
    }
  };

  render() {
    const { checkInManual,currentPredict } = this.state;
    const currentDate = new Date();
    const stringDate = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
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
          <h2 className="text-center">Camera </h2>
          {
            currentPredict ? (
              <div>
                <h3>{`Xác định ${currentPredict.userPredict.email} voi do tin cay ${currentPredict.value}!`}</h3>
                {
                  currentPredict.value<0.7 ? (<h3>Độ tin cậy thấp bạn có thể giám sát thủ công</h3>):null
                }
              </div>
            ):null
          }
          <Divider />

          <Camera
            checkInManual={checkInManual}
            model={this.props.model}
            userOfModel = {this.props.userOfModel}
            handleCheckInAutoSuccess={this.handleCheckInAutoSuccess}
            handleOpenCheckInManually={this.onOpenCheckInManual}
            handleShowCurrentPredict={this.handleShowCurrentPredict}
          />
          <div className="text-center">
            <Button type="danger" onClick={this.onOpenCheckInManual}>
              Giám sát thủ công
            </Button>
          </div>
        </Col>
        <Col style={{ height: '-webkit-fill-available' }} span={12}>
          <h2 className="text-center">Thông tin giám sát: {stringDate}</h2>
          <Divider />
          <Result />
        </Col>
      </Row>
    );
  }
}

LayoutChecker.defaultProps = {};
LayoutChecker.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  model: makeSelectModel(),
  shouldUpdateModel: makeSelectShouldUpdateModel(),
  usersOfModel: makeSelectUsersOfModel(),
});
const mapDispatchToProps = dispatch => ({
  onPredict: payload => dispatch(onPredict(payload)),
  updateModel: payload => dispatch(updateModel(payload)),
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
