import React, { Component } from 'react';
import Steps from 'antd/es/steps';
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import FormSearch from './FormSearch';
import FormCheckIn from './FormCheckIn';
const stepForm = [
  {
    title: 'Tìm kiếm nhân viên',
    component: FormSearch,
  },
  {
    title: 'Xác nhận kết quả',
    component: FormCheckIn,
  },
];
class StepFormWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
      message: false,
      user: null,
    };
  }

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
      alert('loi');
      this.onError('Chua co nhan vien');
    }
  };

  onPrev = () => {
    const step = this.state.step - 1;
    this.setState({ step });
  };

  render() {
    const { step, error, message } = this.state;
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
            <FormCheckIn />
          )}
        </div>
        <div>
          {
            this.state.user ? this.state.user.fullName : 'Chua co nhan vien'
          }
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default StepFormWrapper;
