import React, { Component } from 'react';
import moment from 'moment';
import { database } from 'containers/commons/firebase';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio, DatePicker } from 'antd';
// import schema from './schema';
// import uiSchema from './uiSchema';
// import Demo from './test'
import request from 'utils/request';
import Select from 'antd/es/select';
import ReactQuill from 'react-quill';
import './react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css'; // ES6
const onSubmit = formData => console.log('Data submitted: ', formData);
const { TextArea } = Input;
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().add(2, 'days');
}
class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
      text: '',
    };
  }

  handleChange = value => {
    this.setState({ text: value });
  };

  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const newValue = { ...values, descriptions: this.state.text };
      console.log(newValue);
      request('/api/notification', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(newValue), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          this.handleReset();
          this.props.onSuccess();
        })
        .catch(err => {});
    });
  };

  handleWhenTick = e => {
    alert(`checked = ${e.target.checked}`);
    this.setState({ type: e.target.checked });
  };

  handeChooseType = (value, label) => {
    alert(JSON.stringify(value));
    this.setState({ type: value });
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
    const config = {
      rules: [
        { type: 'object', required: true, message: 'Chọn ngày xin nghỉ!' },
      ],
    };
    return (
      <div>
        <Form layout="vertical" onSubmit={this.submit} className="login-form">
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input title!' }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Enter title"
              />,
            )}
          </Form.Item>
          {/* <Form.Item> */}
          {/* {getFieldDecorator('descriptions', { */}
          {/* rules: [{ required: true, message: 'Please input description!' }], */}
          {/* })(<TextArea placeholder="Enter descriptions" rows={8} />)} */}
          {/* </Form.Item> */}
          <ReactQuill
            style={{ height: '400px' }}
            value={this.state.text}
            onChange={this.handleChange}
          >
            {/* <div className="my-editing-area" style={{height:'400px'}}/> */}
          </ReactQuill>
          <Form.Item label="Chọn người nhận thông báo" hasFeedback>
            {getFieldDecorator('type', {
              valuePropName: 'defaultValue',
              initialValue: '1',
            })(
              <Select
                onChange={this.handeChooseType}
                placeholder="Please select a notification type"
              >
                <Select.Option value="1">Tất cả</Select.Option>
                <Select.Option disabled value="2">
                  Chỉ định
                </Select.Option>
              </Select>,
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
const NewForm = Form.create({ name: 'new_request' })(New);
export default NewForm;
