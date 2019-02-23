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
    };
  }

  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      console.log(values.date.unix());
      const date = values.date.unix();
      // database.ref("/request")
      //   .push({...values,date:date,status:0});
      request('/api/request', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ ...values, date }), // data can be `string` or {object}!
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
          <Form.Item>
            {getFieldDecorator('descriptions', {
              rules: [{ required: true, message: 'Please input description!' }],
            })(<TextArea placeholder="Enter descriptions" rows={4} />)}
          </Form.Item>
          <Form.Item label="Chọn loại yêu cầu" hasFeedback>
            {getFieldDecorator('select', {
              valuePropName: 'defaultValue',
              initialValue: '1',
            })(
              <Select
                onChange={this.handeChooseType}
                placeholder="Please select a request type"
              >
                <Select.Option value="1">Xin nghỉ</Select.Option>
                <Select.Option disabled value="2">
                  Xin cập nhật thông tin
                </Select.Option>
                <Select.Option disabled value="3">
                  Xin ứng lương
                </Select.Option>
              </Select>,
            )}
          </Form.Item>
          {this.state.type == '1' ? (
            <Form.Item label="Yêu cầu xin nghỉ phải trước 2 ngày">
              {getFieldDecorator('date', config)(
                <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />,
              )}
            </Form.Item>
          ) : null}
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
