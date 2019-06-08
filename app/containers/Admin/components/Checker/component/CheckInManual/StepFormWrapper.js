import React, { Component } from 'react';
import styled from 'styled-components';
import Steps from 'antd/es/steps';
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import request from 'utils/request';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Modal from 'antd/es/modal/Modal';
import FormSearch from './FormSearch';
import FormCheckIn from './FormCheckIn';
import { makeSelectCurrentUser } from '../../../../../App/selectors';
import { onUpdateListCheckIn } from '../../actions';
import User from './User';
const Error = styled.div`
  text-align: center;
  color: red;
`;
// const User = ({ user ,showModal}) => (
//   <List.Item key={user.iid}>
//     <List.Item.Meta
//       avatar={
//         <Avatar src={getPathImage(user.avatar)} />
//       }
//       title={<a href="#" onClick={showModal}>{user.email}</a>}
//     />
//   </List.Item>
// );
class StepFormWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
      message: false,
      user: null,
      statusCheckIn: 1,
      check_in_detail: false,
    };
  }

  onChangeStatus = e => {
    this.setState({
      statusCheckIn: e.target.value,
    });
  };

  onSearchSuccess = data => {
    if (data.success) {
      this.setState({
        user: data.payload.user,
        check_in_detail: data.payload.check_in_detail,
        error: false,
        message: false,
      });
    } else {
      // this.setState({ message: data.err, error: true });
      this.onError(data.err);
    }
  };

  onError = message => {
    this.setState({
      error: true,
      message,
    });
  };

  onNext = () => {
    if (this.state.user != null && !this.state.error) {
      const step = this.state.step + 1;
      this.setState({ step });
    } else {
      this.onError(this.state.message);
    }
  };

  onPrev = () => {
    const step = this.state.step - 1;
    this.setState({ step });
  };

  onSave = () => {
    // alert(JSON.stringify(this.state.statusCheckIn));
    const values = {
      userIid: this.state.user.iid,
      statusCheckIn: this.state.statusCheckIn,
      idCheckInDetail: this.state.check_in_detail._id,
    };
    request('/api/check-in', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(values), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        this.setState({ step: 0, user: null });
        this.props.onUpdateListCheckIn(data.listCheckSuccess);
        this.props.onCheckInSuccess();
      })
      .catch(e => console.log(e));
  };

  render() {
    const { step, error, message, statusCheckIn } = this.state;
    console.log(message);
    return (
      <div>
        <Steps size="small" status={error ? 'error' : null} current={step}>
          <Steps.Step title="Tìm kiếm nhân viên" />
          <Steps.Step title="Xác nhận" />
        </Steps>
        <Divider />
        <div className="steps-content">
          {step == 0 ? (
            <FormSearch
              onError={this.onError}
              onSearchSuccess={this.onSearchSuccess}
            />
          ) : (
            <FormCheckIn onChange={this.onChangeStatus} value={statusCheckIn} />
          )}
        </div>
        <div>
          {this.state.user ? <User user={this.state.user} /> : null}
          {/* {this.state.user} */}
        </div>
        <Divider />
        <div className="text-center">
          {step == 0 ? (
            <div>
              <p style={{ color: 'red' }}>{message || null}</p>
              <Button onClick={this.onNext} type="primary">
                Next
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={this.onPrev} type="primary">
                Prev
              </Button>
              <Button onClick={this.onSave} type="primary">
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});
const mapDispatchToProps = dispatch => ({
  onUpdateListCheckIn: payload => dispatch(onUpdateListCheckIn(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(StepFormWrapper));
