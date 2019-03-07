import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form/Form';
import Icon from 'antd/es/icon';
import Input from 'antd/es/input/Input';
import Button from 'antd/es/button/button';
import request from 'utils/request';
class FormSearch extends Component {
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        request(`/api/employee/${values.iid}`)
          .then(data => {
            this.props.onSearchSuccess(data.payload);
          })
          .catch(e => console.log(e));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="inline" onSubmit={this.onSubmit}>
          <Form.Item>
            {getFieldDecorator('iid', {
              rules: [{ required: true, message: 'Please input Iid!' }],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Iid"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="circle"
              icon="search"
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
}
FormSearch.propTypes = {
  onError: PropTypes.func.isRequired,
  onSearchSuccess: PropTypes.func.isRequired,
};
const WrappedNormalFormSearch = Form.create({ name: 'FormSearch' })(FormSearch);
export default WrappedNormalFormSearch;
