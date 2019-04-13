import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio } from 'antd';
// import schema from './schema';
// import uiSchema from './uiSchema';
// import Demo from './test'
import request from 'utils/request';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { makeSelectCurrentUser } from '../../../App/selectors';
class FormChangePassWord extends Component {
  constructor(props) {
    console.log('dasdasd')
    super(props);
    this.state = {
      err: false,
    };
  }

  submit = e => {
    e.preventDefault();
    const {currentUser} = this.props;
    this.props.form.validateFields((err, values) => {
      // alert(JSON.stringify(values));
      if (err) {
      } else {
        request(`/api/employee/${currentUser.iid}/change-password`, {
          method: 'PUT', // or 'PUT'
          body: JSON.stringify(values), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res.success) {
              this.handleReset();
              localStorage.removeItem('token');
              this.props.history.replace('/');
              // this.props.onSuccess();
            } else {
              this.setState({ err: res.err });
            }
          })
          .catch(err => {});
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="vertical" onSubmit={this.submit} className="login-form">
          <Form.Item
          // validateStatus={this.state.err ? 'error' : ''}
          // hasFeedback
          // help={this.state.err ? this.state.err : ''}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your old password!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Enter your old password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('newPassword', {
              rules: [
                { required: true, message: 'Please input your new password!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="enter your new password"
              />,
            )}
          </Form.Item>

          <div style={{ color: 'red' }}>{this.state.err}</div>
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Clear
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

FormChangePassWord.defaultProps = {};
FormChangePassWord.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);
const NewForm = Form.create({ name: 'form_change_password' })(
  FormChangePassWord,
);
export default withRouter(compose(withConnect)(NewForm));
