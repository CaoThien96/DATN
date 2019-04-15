import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio } from 'antd';
// import schema from './schema';
// import uiSchema from './uiSchema';
// import Demo from './test'
import request from 'utils/request';
class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
    };
  }

  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // alert(JSON.stringify(values));
      if (err) {
      } else {
        request('/api/employee', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(values), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res.success) {
              this.handleReset();
              this.props.onSuccess();
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
    const formItemLayout = {
      // labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
        <Form layout="vertical" onSubmit={this.submit} className="login-form">
          <Form.Item
            // validateStatus={this.state.err ? 'error' : ''}
            // hasFeedback
            // help={this.state.err ? this.state.err : ''}
          >
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
              />,
            )}
          </Form.Item>
          {/*<Form.Item>*/}
            {/*{getFieldDecorator('password', {*/}
              {/*rules: [*/}
                {/*{ required: true, message: 'Please input your password!' },*/}
              {/*],*/}
            {/*})(*/}
              {/*<Input*/}
                {/*prefix={*/}
                  {/*<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />*/}
                {/*}*/}
                {/*type="password"*/}
                {/*placeholder="password"*/}
              {/*/>,*/}
            {/*)}*/}
          {/*</Form.Item>*/}
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
          <div style={{color:'red'}}>
            {this.state.err}
          </div>
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
