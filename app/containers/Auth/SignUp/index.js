import React, { PureComponent } from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { Link } from 'react-router-dom';
// import Request from 'utils/request.api';
import './styles.css';

const FormItem = Form.Item;
class NormalLoginForm extends PureComponent {
  handleSubmit = e => {
    // e.preventDefault();
    // const { history } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //     Request.post('/api/users/register', values)
    //       .then(res => res.data)
    //       .then(data => {
    //         if (data && data.success) {
    //           console.log(data);
    //           history.push('/user/signin');
    //         } else {
    //           alert('Co loi xay ra vui long thu lai!!!');
    //         }
    //       })
    //       .catch(err => {
    //         console.log({ err });
    //       });
    //   }
    // });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="display-content ">
        <h1 className="text-center text-header-form">Register</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: 'Please input your username!' },
                // {
                //   validator: (rule, value, callback) => {
                //     const { getFieldValue } = this.props.form;
                //     const username = value;
                //     const myApi = new API({ url: 'http://localhost:3000/api' });
                //     myApi.createEntity({ name: 'user' });
                //     myApi.endpoints.user
                //       .getAll({ username: value })
                //       .then(({ data }) => {
                //         if (data.success) {
                //           callback();
                //         } else {
                //           callback('Username da ton tai');
                //         }
                //       });
                //   },
                // },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
                {
                  min: 4,
                  message: 'Please input your Password min 4 charter!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('re_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input repeat your Password!',
                },
                {
                  validator: (rule, value, callback) => {
                    const { getFieldValue } = this.props.form;
                    if (value && value !== getFieldValue('password')) {
                      callback('Mật khẩu không khớp');
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Re Password"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('restaurant', {
              valuePropName: 'checked',
              initialValue: false,
            })(<Checkbox>Tôi là shop bán hàng</Checkbox>)}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Register new acount
            </Button>
            <Link to="/user/signin">Or login now!</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;
