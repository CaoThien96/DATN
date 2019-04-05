import React, { Component } from 'react';
import Col from 'antd/es/grid/col';
import Avatar from 'antd/es/avatar';
import Row from 'antd/es/grid/row';
import { Input } from 'antd';

const { TextArea } = Input;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReply: false,
    };
  }

  onClickReply = () => {
    this.setState(prevState => {
      const isReply = !prevState.isReply;
      return { ...prevState, isReply };
    });
  };
  handleReply = (e)=>{
    const keyCode = e.keyCode;
    const {currentUser} = this.props
    if(keyCode == 13){
      this.props.onHandleReply(true,{
        iid:(this.props.iid),
        comment:{
          u:{
            email:(currentUser.email),
            iid:(currentUser.iid)
          },
          content:(e.target.value)
        }
      })
      e.target.value=null;
      this.setState({isReply:false})
    }
  }
  render() {
    const { comment,currentUser } = this.props;
    const { isReply } = this.state;
    return (
      <div>
        <Row className="m-t-15">
          <Col span={1}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </Col>
          <Col className="m-l-15" span={20}>
            <Row>
              <a>{comment.u.email}</a> {comment.content}
            </Row>
            <Row>
              <a onClick={this.onClickReply}>Tra loi</a>
            </Row>

          </Col>
        </Row>
        <Row style={{ marginLeft: '20px', marginTop: '15px' }}>
          {
            comment.reply && comment.reply.map((el,key)=>(
              <Row key={key}>
                <Col span={1}>
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Col>
                <Col className="m-l-15" span={20}>
                  <Row>
                    <a>{el.u.email}</a> {el.content}
                  </Row>
                </Col>
              </Row>
            ))
          }
        </Row>
        {isReply ? (
          <Row>
                <TextArea
                  placeholder="Autosize height based on content lines"
                  autosize
                  onKeyDown={this.handleReply}
                />
          </Row>
        ) : null}
      </div>
    );
  }
}

export default Index;
