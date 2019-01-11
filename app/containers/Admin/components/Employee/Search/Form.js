import React from 'react';
import { Form, Icon, Input, Row, Col} from 'antd';

export default ({ getFieldDecorator }) => (
  <div>
    <Row>
      <Col span={12}>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Code"
            />,
          )}
        </Form.Item>
      </Col>
    </Row>
  </div>
);
