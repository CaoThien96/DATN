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
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import CommentWrapper from 'components/Comment';
import ImageGallery from 'react-image-gallery';
import Comment from './Comment';
import { updateRequestDetail, addComment, addReply } from '../../actions';
import { makeSelectCurrentUser } from '../../../../../App/selectors';
import { makeSelectRequestDetail } from '../../selectors';
import 'react-image-gallery/styles/css/image-gallery.css';
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
    console.log('componentWillMount');
    const id = match.params.id;
    request(`/api/request/${id}`).then(data => {
      this.setState({ requestDetail: data.payload });
      this.props.updateRequestDetail(data.payload);
    });
  }

  handleGetDetail = () => {
    const { match } = this.props;
    const id = match.params.id;
    request(`/api/request/${id}`).then(data => {
      this.setState({ requestDetail: data.payload });
    });
  };

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
    const { requestDetail } = this.props;
    // const { requestDetail } = this.state;
    const { getFieldDecorator } = this.props.form;
    const images =
      requestDetail.images &&
      requestDetail.images.map(el => ({
        original: `http://localhost:3000/request/${el}`,
        thumbnail: `http://localhost:3000/request/${el}`,
      }));
    return !requestDetail ? (
      <LoadingIndicator />
    ) : (
      <div>
        <Row>
          <Col style={{paddingRight:'20px'}} span={14}>
            <Row>
              <Col span={6}>Tiêu đề: {requestDetail.title}</Col>
              <Col span={6}>Người gửi: {requestDetail.u.email}</Col>
              <Col span={6}>
                Trạng thái xử lý:{' '}
                {requestDetail.status == 0
                  ? 'Đang chờ'
                  : requestDetail.status == 1
                    ? 'Chấp nhận'
                    : requestDetail.status == 2
                      ? 'Không chấp nhận'
                      : 'Hủy bỏ'}
              </Col>
            </Row>
            <Divider />
            <Row>
              <p>
                Chi tiết:
                {requestDetail.descriptions}
              </p>
            </Row>
            {requestDetail.images && (
              <Row>
                <ImageGallery items={images} />
              </Row>
            )}
          </Col>
          <Col span={10}>
            <CommentWrapper
              addComment={this.props.addComment}
              addReply={this.props.addReply}
              objectDetail={requestDetail}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
const WrappedHorizontalLoginForm = Form.create({ name: 'add_comment' })(
  RequestDetail,
);
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  requestDetail: makeSelectRequestDetail(),
});
const mapDispatchToProps = dispatch => ({
  updateRequestDetail: payload => dispatch(updateRequestDetail(payload)),
  addComment: payload => dispatch(addComment(payload)),
  addReply: payload => dispatch(addReply(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(WrappedHorizontalLoginForm));
