import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import { Button, Form, Icon, Input, Radio } from 'antd';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import message from 'antd/es/message';
import * as lodash from 'lodash';
import Upload from 'antd/es/upload/Upload';
import { makeSelectCurrentUser } from '../../../App/selectors';
import request from '../../../../utils/request';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      err: false,
      fileList: [],
    };
  }

  submit = e => {
    e.preventDefault();
    const { currentUser } = this.props;
    this.props.form.validateFields((err, values) => {
      // alert(JSON.stringify(values));
      if (err) {
      } else {
        // alert(JSON.stringify(values));
        const formData = new FormData();
        lodash.forEach(values, (value, key) => {
          if (key == 'files') {
            value.forEach(el => {
              formData.append('files[]', el.originFileObj);
            });
          } else {
            formData.append(key, value);
          }
        });
        // console.log(formData.get('files')[0]);
        request(`/api/employee/${currentUser.iid}`, {
          method: 'PUT', // or 'PUT'
          body: formData, // data can be `string` or {object}!
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        }).then(data => {
          if (data.success) {
            message.success('Cập nhật thông tin thành công');
          } else {
            message.error('Có lỗi khi cập nhật thông tin');
          }
        });
        // request(`/api/employee/${currentUser.iid}`, {
        //   method: 'PUT', // or 'PUT'
        //   body: JSON.stringify(values), // data can be `string` or {object}!
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // })
        //   .then(res => {
        //     if (res.success) {
        //       // this.handleReset();
        //       // this.props.onSuccess();
        //       alert(JSON.stringify(res));
        //     } else {
        //       this.setState({ err: res.err });
        //     }
        //   })
        //   .catch(err => {});
      }
    });
  };

  componentDidMount() {
    const { currentUser } = this.props;
    this.props.form.setFieldsValue({
      email: currentUser.email,
    });
    this.props.form.setFieldsValue({
      phone: currentUser.phone,
    });
    this.props.form.setFieldsValue({
      full_name: currentUser.full_name,
    });
    this.setState({ fileList });
    const fileList = [
      {
        uid: '-1',
        name: currentUser.avatar,
        status: 'done',
        url: `http://localhost:3000/avatar/${currentUser.avatar}`,
      },
    ];
    this.props.form.setFieldsValue({
      files: fileList,
    });
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    if(e.fileList.length){
      return [e.fileList[e.fileList.length - 1]];
    }else{
      return e && e.fileList
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.form.getFieldValue('files'));
    return (
      <div>
        <h2>Basic setting</h2>
        <Row>
          <Col />
        </Row>
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
                disabled
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
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
          <Form.Item label="Upload">
            {getFieldDecorator('files', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                beforeUpload={() => false}
                onChange={this.handleChange}
              >
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              </Upload>,
            )}
          </Form.Item>
          <div style={{ color: 'red' }}>{this.state.err}</div>
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
        {/* <img src="http://localhost:3000/avatar/1046.jpg" /> */}
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);
const UpdateInformation = Form.create({ name: 'update_information' })(Index);
export default withRouter(compose(withConnect)(UpdateInformation));
// export default UpdateInformation;
