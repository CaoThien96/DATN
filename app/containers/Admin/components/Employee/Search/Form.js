import React from 'react';
import { Form, Icon, Input, Row, Col,Checkbox} from 'antd';
import Radio from 'antd/es/radio/radio';

export default ({ getFieldDecorator }) => (
  <div>
    <Row>
      <Col span={4}>
        <Form.Item>
          {getFieldDecorator('iid')(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Nhập nhân viên"
            />,
          )}
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item>
          {getFieldDecorator('email')(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Nhập email"
            />,
          )}
        </Form.Item>
      </Col>
      <Col span={9}>
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
    <row>
      <Col span={24}>
        <Form.Item>
          {getFieldDecorator('role',{
            initialValue: 1000,
          })(
            <Radio.Group>
              <Radio value={1000}>Nhân viên</Radio>
              <Radio value={1002}>Giám sát viên</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Col>
    </row>
  </div>
);
