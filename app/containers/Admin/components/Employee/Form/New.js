import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio } from 'antd';
// import schema from './schema';
// import uiSchema from './uiSchema';
// import Demo from './test'
import request from 'utils/request';
const onSubmit = formData => console.log('Data submitted: ', formData);
class New extends Component {
  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      alert(JSON.stringify(values));
      // request('/api/employee', {
      //   method: 'POST', // or 'PUT'
      //   body: JSON.stringify(values), // data can be `string` or {object}!
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      //   .then(res => {
      //     this.handleReset();
      //     this.props.onSuccess();
      //   })
      //   .catch(err => {
      //   });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      // labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
        <Form layout="vertical" onSubmit={this.submit} className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your password!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('full_name', {
              rules: [
                { required: true, message: 'Please input your full name!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="enter your full name"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone!' }],
            })(
              <Input
                prefix={
                  <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="enter your phone number"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('role', {
              valuePropName: 'defaultValue',
              initialValue: 1001,
            })(
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio value={1001}>Nhân Viên</Radio>
                <Radio value={1002}>Giám Sát Viên</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
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

New.defaultProps = {};
New.propTypes = {};
const NewForm = Form.create({ name: 'new_employee' })(New);
export default NewForm;
