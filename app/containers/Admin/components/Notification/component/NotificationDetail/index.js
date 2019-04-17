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
import { makeSelectNotificationDetail } from '../../selectors';
import CommentWrapper from 'components/Comment';
import PreviewHtml from './PreviewHtml';
import { updateNotificationDetail, addComment } from '../../actions';
import Divider from 'antd/es/divider';
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
      })
      .catch(err => {});
  }

  render() {
    const { currentUser, notificationDetail } = this.props;
    return notificationDetail ? (
      <Row gutter={16}>
        <Col span={12} style={{ borderRight: '1px solid' }}>
          <h1>{notificationDetail.title}</h1>
          <PreviewHtml>
            {notificationDetail.descriptions !== undefined
              ? notificationDetail.descriptions
              : ''}
          </PreviewHtml>
        </Col>
        <Col span={12}>
          <CommentWrapper addComment={this.props.addComment}  objectDetail={notificationDetail} />
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
  updateNotificationDetail: payload => dispatch(updateNotificationDetail(payload)),
  addComment: payload => dispatch(addComment(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(Index));
