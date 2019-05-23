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
import {
  updateRequestDetail,
  addComment,
  addReply,
  fetchRequestDetail,
} from '../../actions';
import { makeSelectCurrentUser } from '../../../../../App/selectors';
import { makeSelectRequestDetail } from '../../selectors';
import 'react-image-gallery/styles/css/image-gallery.css';
import Select from 'antd/es/select';
import CanWrapper from '../../Can';
import Typography from 'antd/es/typography';
import { updateNews } from '../../../../actions';

const { Text } = Typography;
const Option = Select.Option;
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
    this.props.fetchRequestDetail({ id });
    // request(`/api/request/${id}`).then(data => {
    //   this.setState({ requestDetail: data.payload });
    //   this.props.updateRequestDetail(data.payload);
    // });
  }

  componentWillReceiveProps(nextProps) {
    const nextIid = nextProps.match.params.id;
    const { match } = this.props;
    const iid = match.params.id;
    if (nextIid !== iid) {
      this.props.fetchRequestDetail({ id: nextIid });
      this.props.updateNews();
    }
  }

  handleGetDetail = () => {
    const { match } = this.props;
    const id = match.params.id;
    request(`/api/request/${id}`).then(data => {
      this.setState({ requestDetail: data.payload });
    });
  };

  handleChangeActive = (item, status) => {
    const { match } = this.props;
    const id = match.params.id;
    request(`/api/request/${item.iid}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(data => {
      this.props.fetchRequestDetail({ id });
    });
  };

  render() {
    const { requestDetail } = this.props;
    console.log({ requestDetail });
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
          <Col style={{ paddingRight: '20px' }} span={14}>
            <Row>
              <Col span={12}>Tiêu đề: {requestDetail.title}</Col>
              <Col span={12}>
                <Text>Người gửi: {requestDetail.u.email}</Text>
              </Col>
              <Col span={12}>
                Trạng thái xử lý:{' '}
                {requestDetail.status == 0 ? (
                  <Text type="warning">Đang chờ</Text>
                ) : requestDetail.status == 1 ? (
                  <Text type="secondary" style={{ color: 'blue' }}>
                    Chấp nhận
                  </Text>
                ) : requestDetail.status == 2 ? (
                  <Text type="danger">Không chấp nhận</Text>
                ) : (
                  'Hủy bỏ'
                )}
              </Col>
              <Col span={12}>
                {requestDetail.status == 0 ? (
                  <CanWrapper
                    I="handle"
                    a="Request"
                    user={this.props.currentUser}
                  >
                    <span>Xử lý yêu cầu: </span>
                    {requestDetail.status == 0 ? (
                      <Select
                        style={{ width: '150px' }}
                        placeholder="Xử lý yêu cầu"
                        onChange={status =>
                          this.handleChangeActive(requestDetail, status)
                        }
                      >
                        <Option value="1">Accept</Option>
                        <Option value="2">Reject</Option>
                      </Select>
                    ) : (
                      <span>
                        <Select
                          style={{ width: '150px' }}
                          placeholder="Handle request"
                          onChange={status =>
                            this.handleChangeActive(requestDetail, status)
                          }
                          defaultValue={requestDetail.status.toString()}
                        >
                          <Option value="1">Chấp nhận</Option>
                          <Option value="2">Từ chối</Option>
                        </Select>
                      </span>
                    )}
                  </CanWrapper>
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
            {requestDetail.images.length ? (
              <Row>
                <ImageGallery items={images} />
              </Row>
            ) : null}
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
  fetchRequestDetail: payload => dispatch(fetchRequestDetail(payload)),
  updateNews: () => dispatch(updateNews()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(WrappedHorizontalLoginForm));
