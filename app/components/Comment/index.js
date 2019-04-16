import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from 'containers/App/selectors';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Row from 'antd/es/grid/row';
import CommentWrraper from './CommentWrraper';
import TextArea from './TextArea';
import request from '../../utils/request';

class Index extends Component {
  handleOnKeyDown = e => {
    const keyCode = e.keyCode;
    const { objectDetail, currentUser } = this.props;
    if (keyCode == 13) {
      e.preventDefault();
      const content = e.target.value;
      let { comments } = objectDetail;
      const newComment = {
        reply: [],
        u: {
          email: currentUser.email,
          iid: currentUser.iid,
        },
        content,
        time: new Date(),
      };
      comments = [...comments, newComment];
      this.props.addComment({ objectDetail, comments });
      e.target.value = null;
    }
  };

  handleAddReply = (iidComment, content) => {
    const { objectDetail, currentUser } = this.props;
    console.log({ iidComment, content });

    const comments = objectDetail.comments;
    console.log(this.props.objectDetail);
    const index = comments.findIndex(el => {
      if (el._id == iidComment) {
        return true;
      }
      return false;
    });
    if (index !== -1) {
      comments[index].reply.push({
        u: {
          email: currentUser.email,
          iid: currentUser.iid,
        },
        content,
        time: new Date(),
      });
      this.props.addComment({ objectDetail, comments });
    }
  };

  render() {
    const { objectDetail, currentUser } = this.props;
    return (
      <div>
        <Row>
          <TextArea
            placeholder="Nhập bình luận"
            handleOnKeyDown={this.handleOnKeyDown}
          />
        </Row>
        <Row>
          <CommentWrraper
            objectDetail={objectDetail}
            currentUser={currentUser}
            handleAddReply={this.handleAddReply}
          />
        </Row>
      </div>
    );
  }
}
Index.propTypes = {
  addComment: PropTypes.func.isRequired,
  objectDetail: PropTypes.object.isRequired,
};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);
export default withRouter(compose(withConnect)(Index));
