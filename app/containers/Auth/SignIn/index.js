import React, { Component } from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import styled from 'styled-components';
import './styles.css';
import request from 'utils/request';

const Error = styled.div`
  color: red;
`;
const FormItem = Form.Item;
class NormalLoginForm extends Component {
  state = {
    error: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { history } = this.props;
    this.props.form.validateFields((err, values) => {
      if(!err){
        request('/sign-in', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(values), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            if(res.success){
              localStorage.setItem('token', res.token);
              history.replace('/admin')
            }else{
              this.setState({err:res.err})
            }
          })
          .catch(err => {
            console.log({err})
            console.log(err.toString() )
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="display-content ">
        <h1 className="text-center text-header-form">Login</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please input your email!' },
                { min: 6, message: 'Email is min 6 charter!' },
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
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
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
          {this.state.error && (
            <Error>Username or password not correct!!</Error>
          )}
          <div>
            {
              this.state.err?(
                <div style={{color:'red'}}>
                  {this.state.err}
                </div>
              ):null
            }
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;
