import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import { Button, Form, Icon, Input, Radio } from 'antd';
import request from '../../../../utils/request';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from '../../../App/selectors';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Upload from 'antd/es/upload/Upload';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state={
      err:false
    }
  }

  submit = e => {
    e.preventDefault();
    const {currentUser} = this.props;
    this.props.form.validateFields((err, values) => {
      // alert(JSON.stringify(values));
      if (err) {
      } else {
        alert(JSON.stringify(values));
        request(`/api/employee/${currentUser.iid}`, {
          method: 'PUT', // or 'PUT'
          body: JSON.stringify(values), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if (res.success) {
              // this.handleReset();
              // this.props.onSuccess();
              alert(JSON.stringify(res))
            } else {
              this.setState({ err: res.err });
            }
          })
          .catch(err => {});
      }
    });
  };
  componentDidMount(){
    const {currentUser} = this.props;
    this.props.form.setFieldsValue({
      email:currentUser.email,
    })
    this.props.form.setFieldsValue({
      phone:currentUser.phone
    })
    this.props.form.setFieldsValue({
      full_name:currentUser.full_name
    })
  }
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {currentUser} = this.props;

    console.log(currentUser)
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
          <Form.Item
            label="Upload"
            extra="longgggggggggggggggggggggggggggggggggg"
          >
            {getFieldDecorator('upload', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button>
                  <Icon type="upload" /> Click to upload
                </Button>
              </Upload>
            )}
          </Form.Item>
          <div style={{ color: 'red' }}>{this.state.err}</div>
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              Update information
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(
  mapStateToProps,
);
const UpdateInformation = Form.create({ name: 'update_information' })(Index);
export default withRouter(compose(withConnect)(UpdateInformation));
// export default UpdateInformation;
