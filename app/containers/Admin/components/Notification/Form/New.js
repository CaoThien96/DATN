import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox, Radio, DatePicker } from 'antd';
import request from 'utils/request';
import requestV2 from 'utils/requestV2';
import Select from 'antd/es/select';
import ReactQuill from 'react-quill';
import './react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import Upload from 'antd/es/upload/Upload'; // ES6
import message from 'antd/es/message';
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
      requestV2('/api/notification', {
        method: 'POST',
        body: newValue,
      }).then(data => {
        if (data.success) {
          this.handleReset();
          this.props.onSuccess();
        } else {
          message.error('something errors');
        }
      });
      // request('/api/notification', {
      //   method: 'POST', // or 'PUT'
      //   body: JSON.stringify(newValue), // data can be `string` or {object}!
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      //   .then(res => {
      //     this.handleReset();
      //     this.props.onSuccess();
      //   })
      //   .catch(err => {});
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

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
        <Form layout="vertical" onSubmit={this.submit}>
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Tiêu đề thông báo không để trống!' }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Nhập tiêu đều thông báo"
              />,
            )}
          </Form.Item>
          {/* <Form.Item> */}
          {/* {getFieldDecorator('descriptions', { */}
          {/* rules: [{ required: true, message: 'Please input description!' }], */}
          {/* })(<TextArea placeholder="Enter descriptions" rows={8} />)} */}
          {/* </Form.Item> */}
          <ReactQuill
            style={{ height: '100px', marginBottom: '15px' }}
            value={this.state.text}
            onChange={this.handleChange}
          >
            {/* <div className="my-editing-area" style={{height:'400px'}}/> */}
          </ReactQuill>
          <br/>
          <br/>

          <Form.Item >
            {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                beforeUpload={() => false}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Tải ảnh</div>
                </div>
              </Upload>,
            )}
          </Form.Item>
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
