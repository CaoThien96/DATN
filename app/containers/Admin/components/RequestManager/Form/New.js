import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
// import Form from 'react-jsonschema-form';
import { Form, Icon, Input, Button, Checkbox, Radio, DatePicker } from 'antd';
import request from 'utils/request';
import Select from 'antd/es/select';
import Upload from 'antd/es/upload/Upload';
import requestV2 from 'utils/requestV2';
import message from 'antd/es/message';

const { TextArea } = Input;

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
      resultSearch: false,
    };
  }

  componentWillMount() {
    const { currentUser } = this.props;

    const json = JSON.stringify({ status: [1, 0, 2] });
    const apiUrl = `/api/request?value=${json}`;
    request(apiUrl)
      .then(data => {
        if (data.success) {
          let resultSearch = [];
          if (currentUser.role === 1000) {
            resultSearch = data.payload.filter(el => {
              if (el.u.iid === currentUser.iid) {
                return true;
              }
            });
          } else {
            resultSearch = data.payload;
          }
          console.log({ resultSearch });
          this.setState({ resultSearch });
        }
      })
      .catch(err => alert(err));
  }

  submit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const date = values.date.unix() * 1000;

      if (err) {
        console.log(err);
        return;
      }
      requestV2('/api/request', {
        method: 'POST',
        body: { ...values, date },
      }).then(data => {
        if (data.success) {
          this.handleReset();
          this.props.onSuccess();
        } else {
          message.error('something errors');
        }
      });
      // request('/api/request', {
      //   method: 'POST', // or 'PUT'
      //   body: JSON.stringify({ ...values, date }), // data can be `string` or {object}!
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

  disabledDate = (current = moment()) => {
    // Can not select days before today and today
    if (current && current < moment().subtract(1, 'days')) {
      return true;
    }
    console.log({ current });
    const { resultSearch } = this.state;
    if (resultSearch) {
      const date = resultSearch.map(el => ({
        year: new Date(el.addition.date).getFullYear(),
        month: new Date(el.addition.date).getMonth(),
        date: new Date(el.addition.date).getDate(),
      }));
      console.log({date})
      const index = date.findIndex(el => {
        if (
          el.year == current.year() &&
          el.month == current.month() &&
          el.date == current.date()
        ) {
          return true;
        }
        return false;
      });
      console.log({
        index,
        year: current.year(),
        month: current.month(),
        date: current.date(),
      });
      if (index !== -1) {
        return true;
      }
      return false;
    }
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
        <Form layout="vertical" onSubmit={this.submit} className="login-form">
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input title!' }],
              valuePropName: 'value',
              initialValue: 'Đơn xin nghỉ làm',
            })(
              <Input
                disabled
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Enter title"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('descriptions', {
              rules: [{ required: true, message: 'Please input reason!' }],
            })(<TextArea placeholder="Enter reason" rows={4} />)}
          </Form.Item>
          <Form.Item label="Upload">
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
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>,
            )}
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
                <DatePicker
                  disabledDate={this.disabledDate}
                  format="YYYY-MM-DD"
                />,
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
