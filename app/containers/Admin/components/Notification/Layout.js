import React, { Component } from 'react';
import { database } from 'containers/commons/firebase';
import { Button, Form, Icon, Input } from 'antd';
import Select from 'antd/es/select';
const { TextArea } = Input;
class LayoutNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    // database.ref('/').on('value', snapshot => {
    //   console.log('data change', snapshot.val());
    //   this.setState({
    //     data: snapshot.val(),
    //   });
    // });
  }
  submit = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      alert(JSON.stringify(values));
      database.ref("/request")
        .push({
          title:'cao',
          des:'des'
        });
      // request('/api/employee', {
      //   method: 'POST', // or 'PUT'
      //   body: JSON.stringify(values), // data can be `string` or {object}!
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      //   .then(res => {
      //     this.handleReset();
      //     this.props.onSuccess();
      //   })
      //   .catch(err => {
      //   });
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
          <div className="text-center">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button style={{ marginLeft: 8 }}>
              Clear
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
const LayoutNotificationNewForm = Form.create({ name: 'new_request' })(LayoutNotification);
export default LayoutNotificationNewForm;
