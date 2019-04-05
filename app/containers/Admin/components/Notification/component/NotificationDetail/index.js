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
import Comment from '../Comment/index';
import PreviewHtml from './PreviewHtml';
import { addNotification, addComment } from '../../actions';
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationDetail: null,
      textArea: '',
    };
  }

  componentWillMount() {
    const { match } = this.props;
    const iid = match.params.id;
    request(`/api/notification/${iid}`)
      .then(res => {
        this.setState({
          notificationDetail: res.payload,
        });
        this.props.onAddNotification(res.payload);
      })
      .catch(err => {});
  }

  handleOnKeyUpTextArea = e => {
    const keyCode = e.keyCode;
    const { match, notificationDetail } = this.props;
    const iid = match.params.id;
    console.log(notificationDetail.comments);
    if (keyCode == 13) {
      e.preventDefault();
      const content = e.target.value;
      request(`/api/notification/${iid}/comment`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ content }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          this.props.onAddNotification(res.payload);
          this.props.onAddComment(res.payload);
        })
        .catch(err => {});
      // comments.push({
      //   u:{
      //     email:'trantuan'
      //   },
      //   content:'hello'
      // })
      // this.props.onAddComment(comments)
      // this.setState({
      //   comments,
      // });
      e.target.value = null;
    }
  };

  onHandleReply = (reply, data) => {
    const { match, currentUser, notificationDetail } = this.props;
    const iid = match.params.id;
    const comments = this.state.notificationDetail.comments;
    console.log({ reply, data });
    if (reply) {
      const index = notificationDetail.comments.findIndex(el => {
        if (el._id == data.iid) {
          return true;
        }
        return false;
      });
      console.log(index);
      if (index !== -1) {
        if (comments[index].reply) {
          notificationDetail.comments[index].reply.push(data.comment);
        } else {
          notificationDetail.comments[index].reply = [data.comment];
        }
      }

      console.log({ notificationDetail });
      request(`/api/notification/${iid}/comment`, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ notificationDetail, type: 'reply' }), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          this.props.onAddNotification(res.payload);
          this.props.onAddComment(res.payload);
        })
        .catch(err => {});
      this.props.onAddNotification(notificationDetail);
      // alert(JSON.stringify(cm));
    }
  };

  render() {
    const { comments } = this.state;
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
          <Row>
            <Row>
              <textarea
                style={{ width: '100%' }}
                placeholder="Nhap binh luan"
                onKeyDown={this.handleOnKeyUpTextArea}
              />
            </Row>
            {notificationDetail.comments &&
              notificationDetail.comments.map((el, key) => (
                <Comment
                  iid={el._id}
                  onHandleReply={this.onHandleReply}
                  key={key}
                  comment={el}
                  currentUser={currentUser}
                />
              ))}
            {/* {comments.map((el, key) => ( */}
            {/* <Comment */}
            {/* iid={el.iid} */}
            {/* onHandleReply={this.onHandleReply} */}
            {/* key={key} */}
            {/* comment={el} */}
            {/* /> */}
            {/* ))} */}
          </Row>
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
  onAddNotification: payload => dispatch(addNotification(payload)),
  onAddComment: payload => dispatch(addComment(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(Index));
