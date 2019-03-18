import React, { Component } from 'react';
import styled from 'styled-components';
import Steps from 'antd/es/steps';
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
import request from 'utils/request';
import FormSearch from './FormSearch';
import FormCheckIn from './FormCheckIn';

const Error = styled.div`
  text-align: center;
  color: red;
`;
const User = ({ user }) => (
  <List.Item key={user.iid}>
    <List.Item.Meta
      avatar={
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      }
      title={<a href="https://ant.design">{user.email}</a>}
    />
  </List.Item>
);
class StepFormWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
      message: false,
      user: null,
      statusCheckIn: 1,
    };
  }

  onChangeStatus = e => {
    this.setState({
      statusCheckIn: e.target.value,
    });
  };

  onSearchSuccess = user => {
    this.setState({ user });
  };

  onError = message => {
    this.setState({
      error: true,
      message,
    });
  };

  onNext = () => {
    if (this.state.user != null) {
      const step = this.state.step + 1;
      this.setState({ step });
    } else {
      this.onError('Chua co nhan vien');
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
    };
    request('/api/check-in', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(values), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        alert(JSON.stringify(data))
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
          {this.state.user ? (
            <User user={this.state.user} />
          ) : (
            <Error>Chua co nhan vien</Error>
          )}
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

export default StepFormWrapper;
