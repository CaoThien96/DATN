import React, { Component } from 'react';
import request from 'utils/request';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Avatar from 'antd/es/avatar';
import PreviewHtml from './PreviewHtml';
import Comment from '../Comment/index';
class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationDetail: null,
      comments: [
        {
          iid: 1,
          u: {
            email: 'caothien',
          },
          content: 'hello',
          reply: [
            {
              u: {
                email: 'caoduc',
              },
              content: 'hello',
            },
          ],
        },
        {
          iid: 2,
          u: {
            email: 'caothien',
          },
          content: 'hello',
          reply: [
            {
              u: {
                email: 'caoduc',
              },
              content: 'hello',
            },
          ],
        },
      ],
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
      })
      .catch(err => {});
  }

  handleOnKeyUpTextArea = e => {
    const keyCode = e.keyCode;
    let comments = this.state.comments;
    if (keyCode == 13) {
      e.preventDefault();
      alert(e.target.value);
      comments.push({
        u:{
          email:'trantuan'
        },
        content:'hello'
      })
      this.setState({
        comments,
      });
      e.target.value = null;
    }
  };

  onHandleReply = (reply, data) => {
    const comments = this.state.comments;
    if (reply) {
      const index = comments.findIndex(el => {
        if (el.iid == data.iid) {
          return true;
        }
        return false;
      });
      comments[index].reply.push(data.comment);
      this.setState({
        comments,
      });
      // alert(JSON.stringify(cm));
    }
  };

  render() {
    const { notificationDetail, comments } = this.state;
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
            {comments.map((el, key) => (
              <Comment
                iid={el.iid}
                onHandleReply={this.onHandleReply}
                key={key}
                comment={el}
              />
            ))}
          </Row>
        </Col>
      </Row>
    ) : (
      <div>Không tìm thấy thông báo</div>
    );
  }
}

export default Index;
