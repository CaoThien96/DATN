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
import Alert from 'antd/es/alert';
import Spin from 'antd/es/spin';
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
import {
  getFaceDetectorOptions,
  createFetchMatcher,
} from './common/faceDetectionControls';
class LayoutChecker extends Component {
  constructor(props) {
    super(props);
    this.score = 0.8;
    this.state = {
      checkInManual: false,
      curentPredict: false,
      faceMatch: false,
    };
  }

  async componentDidMount() {
    try {
      const model = await tf.loadModel(
        'http://localhost:3000/model/model.json',
      );
      model.summary();
      const params = JSON.stringify({
        training: 1,
        // status:1,
      });
      const users = await request(`/api/employee?value=${params}`);
      // console.log({ users });
      this.setState({ model, users });
      const faceMatch = await createFetchMatcher(faceapi, users);
      this.setState({ faceMatch });
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
      model.summary();
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

  handleShowCurrentPredict = (indices, value) => {
    if (this.props.usersOfModel) {
      const userPredict = this.props.usersOfModel[indices[0]];
      // console.log({
      //   userPredict,
      //   indices,
      //   usersOfModel: this.props.usersOfModel,
      // });
      this.setState({
        currentPredict: {
          userPredict,
          value,
        },
      });
      /**
       * Gui event bao da tim thay mot doi tuong moi co xac suat okie! Va hay cap nhat trang thai checkin cho doi tuong nay di!!!
       */
    }
  };

  handleCheckInAutoSuccess = indices => {
    if (this.props.usersOfModel) {
      // console.log(this.props.usersOfModel)
      const userPredict = this.props.usersOfModel[indices[0]];
      /**
       * Gui event bao da tim thay mot doi tuong moi co xac suat okie! Va hay cap nhat trang thai checkin cho doi tuong nay di!!!
       */
      this.props.onPredict(userPredict);
    }
  };

  handleCheckInAutoSuccessV2WithFaceMatcher = iid => {
    if (this.props.usersOfModel) {
      // console.log(this.props.usersOfModel)
      const userPredict = this.props.usersOfModel.find(el => {
        if (el.iid == parseInt(iid)) {
          return true;
        }
        return false;
      });
      /**
       * Gui event bao da tim thay mot doi tuong moi co xac suat okie! Va hay cap nhat trang thai checkin cho doi tuong nay di!!!
       */
      this.props.onPredict(userPredict);
    }
  };

  render() {
    const { checkInManual, currentPredict, faceMatch } = this.state;
    const { usersOfModel, model } = this.props;
    const currentDate = new Date();
    const stringDate = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
    return (
      <div>
        {faceMatch && usersOfModel ? (
          <Row>
            <CheckInManual
              onCloseCheckInManual={this.onCloseCheckInManual}
              checkInManual={checkInManual}
              onCheckInManualSuccess={this.onCheckInManualSuccess}
            />
            <Col
              style={{
                borderRight: '1px solid',
                height: '-webkit-fill-available',
              }}
              span={12}
            >
              <h2 className="text-center">Camera </h2>
              {currentPredict ? (
                <div>
                  {currentPredict.value < this.score ? (
                    <Alert message="Hãy giám thủ công!!" type="error" />
                  ) : (
                    <Alert
                      message={`Xác định ${
                        currentPredict.userPredict.email
                      } voi do tin cay ${currentPredict.value}!`}
                      type="success"
                    />
                  )}
                </div>
              ) : null}
              <Divider />

              <Camera
                checkInManual={checkInManual}
                model={this.props.model}
                faceMatch={this.state.faceMatch}
                usersOfModel={this.props.usersOfModel}
                handleCheckInAutoSuccess={this.handleCheckInAutoSuccess}
                handleCheckInAutoSuccessV2WithFaceMatcher={
                  this.handleCheckInAutoSuccessV2WithFaceMatcher
                }
                handleOpenCheckInManually={this.onOpenCheckInManual}
                handleShowCurrentPredict={this.handleShowCurrentPredict}
                score={this.score}
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
        ) : (
          <Spin>Đang tải mô hình</Spin>
        )}
      </div>
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
