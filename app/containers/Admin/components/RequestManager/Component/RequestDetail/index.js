import React, { Component } from 'react';
import request from 'utils/request';
import LoadingIndicator from 'components/LoadingIndicator';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import { Input } from 'antd';
import Switch from 'antd/es/switch';
import Button from 'antd/es/button/button';
import Form from 'antd/es/form/Form';
import Divider from 'antd/es/divider';
import Comment from './Comment';
const { TextArea } = Input;
class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestDetail: null,
    };
  }

  componentWillMount() {
    const { match } = this.props;
    const id = match.params.id;
    request(`/api/request/${id}`).then(data => {
      this.setState({ requestDetail: data.payload });
    });
  }
  handleGetDetail=()=>{
    const { match } = this.props;
    const id = match.params.id;
    request(`/api/request/${id}`).then(data => {
      this.setState({ requestDetail: data.payload });
    });
}
  handeSendComment = e => {
    e.preventDefault();
    const { match } = this.props;
    const id = match.params.id;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // alert(JSON.stringify(values));
        request('/api/request/comment', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify({
            ...values,
            requestIid: id,
            u: {
              email: 'caothien029@gmail.com',
              iid: 1001,
            },
          }), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            this.props.form.resetFields();
            this.handleGetDetail();
            // this.handleReset();
            // this.props.onSuccess();
          })
          .catch(err => {});
      }
    });
  };

  render() {
    const { match } = this.props;
    const { requestDetail } = this.state;
    const { getFieldDecorator } = this.props.form;

    return requestDetail == null ? (
      <LoadingIndicator />
    ) : (
      <div>
        <Row>
          <Col span={6}>Tiêu đề: {requestDetail.title}</Col>
          <Col span={6}>Người gửi: {requestDetail.title}</Col>
          <Col span={6}>
            Trạng thái xử lý:{' '}
            {requestDetail.status == 0
              ? 'Đang chờ'
              : 'Đã hủy'}
          </Col>
          <Col span={6}>
            {requestDetail.status == 1 || requestDetail.status == 2 ? (
              <Switch
                // onChange={status => handleChangeActive(record, status)}
                checkedChildren="Approve"
                unCheckedChildren="Reject"
                checked={requestDetail.status == 1?true:false}
              />
            ) : null}
          </Col>
        </Row>
        <Divider />
        <Row>
          <p>
            Chi tiết:
            {requestDetail.descriptions}
          </p>
        </Row>
        <Divider />
        <Row>
          <Form layout="inline" onSubmit={this.handeSendComment}>
            <Form.Item>
              {getFieldDecorator('comment', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })(<TextArea placeholder="Nhập bình luận ......" rows={4} />)}
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi bình luận
            </Button>
          </Form>
        </Row>
        <Divider />
        <Row>
          <Comment data={requestDetail.comments} />
        </Row>
      </div>
    );
  }
}
const WrappedHorizontalLoginForm = Form.create({ name: 'add_comment' })(
  RequestDetail,
);
export default WrappedHorizontalLoginForm;
