import React from 'react';
import { Form, Icon, Input, Row, Col,Checkbox} from 'antd';

export default ({ getFieldDecorator }) => (
  <div>
    <Row>
      <Col span={6}>
        <Form.Item>
          {getFieldDecorator('iid')(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Tìm kiếm bằng mã nhân viên"
            />,
          )}
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item>
          {getFieldDecorator('email')(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="enter email"
            />,
          )}
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item>
          {getFieldDecorator('status',{
            initialValue: [1],
          })(
            <Checkbox.Group style={{ width: "100%" }}>
              <Row>
                <Col span={4}><Checkbox value={1}>Active</Checkbox></Col>
                <Col span={4}><Checkbox value={2}>Block</Checkbox></Col>
                <Col span={4}><Checkbox value={0}>Delete</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          )}
        </Form.Item>
      </Col>
    </Row>
  </div>
);
