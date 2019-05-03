import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio, DatePicker } from 'antd';
import moment from 'moment';
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
      if (err) {
      } else {
        const customBirthDay = new Date(values.birthday).getTime();
        values.birthday = customBirthDay;
        alert(JSON.stringify(values));
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
  componentWillReceiveProps(nextProps){
    if(!nextProps.visible){
      this.props.form.resetFields();
    }
  }
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
            label="Địa chỉ email"
            // validateStatus={this.state.err ? 'error' : ''}
            // hasFeedback
            // help={this.state.err ? this.state.err : ''}
          >
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'Địa chỉ email không hợp lệ!',
                },
                {
                  required: true,
                  message: 'Email không được để trống!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Nhập địa chỉ email"
              />,
            )}
          </Form.Item>
          {/* <Form.Item> */}
          {/* {getFieldDecorator('password', { */}
          {/* rules: [ */}
          {/* { required: true, message: 'Please input your password!' }, */}
          {/* ], */}
          {/* })( */}
          {/* <Input */}
          {/* prefix={ */}
          {/* <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} /> */}
          {/* } */}
          {/* type="password" */}
          {/* placeholder="password" */}
          {/* />, */}
          {/* )} */}
          {/* </Form.Item> */}
          <Form.Item label="Tên đầy đủ">
            {getFieldDecorator('full_name', {
              rules: [
                { required: true, message: 'Tên đầy đủ không đươc để trống!' },
                { pattern: '^[^0-9.]+$', message: 'Tên đầy đủ không được chứa số!' },

              ],
            })(
              <Input
                prefix={
                  <Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Nhập tên đầy đủ"
              />,
            )}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: 'Số điện thoại không được để trống'
                },
                {
                  type: 'number',
                  message: 'Số điện thoại không được là chữ',
                  transform: value => {
                    const res = Number(value) ? Number(value) : 0;
                    console.log({ value, res });
                    return Number(value) ? Number(value) : '1';
                  },
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Nhập số điện thoại"
              />,
            )}
          </Form.Item>

          <Form.Item label="Ngày sinh">
            {getFieldDecorator('birthday', {
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: 'Ngày sinh không được để trống!',
                },
              ],
            })(<DatePicker format={['DD/MM/YYYY']} />)}
          </Form.Item>
          <Form.Item label="Địa chỉ ở hiện tại">
            {getFieldDecorator('address', {
              rules: [
                { required: true, message: 'Địa chỉ không được để trống!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Nhập địa chỉ ở hiện tại"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('role', {
              valuePropName: 'defaultValue',
              initialValue: 1000,
            })(
              <Radio.Group buttonStyle="solid">
                <Radio value={1000}>Nhân Viên</Radio>
                <Radio value={1002}>Giám Sát Viên</Radio>
              </Radio.Group>,
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

New.defaultProps = {};
New.propTypes = {};
const NewForm = Form.create({ name: 'new_employee' })(New);
export default NewForm;
