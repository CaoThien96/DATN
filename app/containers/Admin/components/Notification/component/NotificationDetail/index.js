import React, { Component } from 'react';
import request from 'utils/request';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Avatar from 'antd/es/avatar';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  makeSelectCurrentUser,
  makeSelectError,
} from 'containers/App/selectors';
import CommentWrapper from 'components/Comment';
import Divider from 'antd/es/divider';
import ImageGallery from 'react-image-gallery';
import { makeSelectNotificationDetail } from '../../selectors';
import PreviewHtml from './PreviewHtml';
import { updateNotificationDetail, addComment } from '../../actions';
import { updateNews } from 'containers/Admin/actions';
import 'react-image-gallery/styles/css/image-gallery.css';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { match } = this.props;
    const iid = match.params.id;
    request(`/api/notification/${iid}`)
      .then(res => {
        this.props.updateNotificationDetail(res.payload);
        this.props.updateNews()
      })
      .catch(err => {});
  }

  componentWillReceiveProps(nextProps) {
    const nextIid = nextProps.match.params.id;
    const { match } = this.props;
    const iid = match.params.id;
    if (nextIid !== iid) {
      request(`/api/notification/${nextIid}`)
        .then(res => {
          this.props.updateNotificationDetail(res.payload);
          this.props.updateNews()
        })
        .catch(err => {});
    }
  }

  render() {
    const { currentUser, notificationDetail } = this.props;
    const images =
      notificationDetail.images &&
      notificationDetail.images.map(el => ({
        original: `http://localhost:3000/notification/${el}`,
        thumbnail: `http://localhost:3000/notification/${el}`,
      }));
    return notificationDetail ? (
      <Row gutter={16}>
        <Col span={12} style={{ borderRight: '1px solid' }}>
          <h1>{notificationDetail.title}</h1>
          <PreviewHtml>
            {notificationDetail.descriptions !== undefined
              ? notificationDetail.descriptions
              : ''}
          </PreviewHtml>
          {notificationDetail.images && notificationDetail.images.length ? (
            <Row>
              <ImageGallery items={images} />
            </Row>
          ) : null}
        </Col>
        <Col span={12}>
          <CommentWrapper
            addComment={this.props.addComment}
            objectDetail={notificationDetail}
          />
        </Col>
      </Row>
    ) : (
      <div>Không tìm thấy thông báo</div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  notificationDetail: makeSelectNotificationDetail(),
  error: makeSelectError(),
});
const mapDispatchToProps = dispatch => ({
  updateNotificationDetail: payload =>
    dispatch(updateNotificationDetail(payload)),
  addComment: payload => dispatch(addComment(payload)),
  updateNews: () => dispatch(updateNews()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(Index));
