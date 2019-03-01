import React, { Component } from 'react';
import request from 'utils/request';
import PreviewHtml from './PreviewHtml';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Avatar from 'antd/es/avatar';
class Index extends Component {
  constructor(props) {
    super(props);
    this.state={
      notificationDetail:null
    }
  }

  componentWillMount(){
    const {match} = this.props
    const iid = match.params.id
    request(`/api/notification/${iid}`)
      .then(res => {
        this.setState({
          notificationDetail:res.payload
        })
      })
      .catch(err => {});
  }
  render() {
    const {notificationDetail} = this.state;
    return notificationDetail ? (
      <Row gutter={16}>
        <Col span={12} style={{borderRight:'1px solid'}}>
          <h1>{notificationDetail.title}</h1>
          <PreviewHtml>{notificationDetail.descriptions}</PreviewHtml>
        </Col>
        <Col span={12}>
          <Row>
            <Row>
              <textarea style={{width:'100%'}} placeholder={'Nhap binh luan'}></textarea>
            </Row>
            <Row className='m-t-15'>
              <Col span={1}>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </Col>
              <Col span={20}>
                <Row>
                  <a>Cao Van Thien</a> dasdasdadasdasdasdadasdasd
                </Row>
                <Row><a>Tra loi</a></Row>
              </Col>
            </Row>
            <Row style={{marginLeft:'20px',marginTop:'15px'}}>
              <Row>
                <Col span={1}>
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Col>
                <Col span={20}>
                  <Row>
                    <a>Cao Van Thien</a> dasdasdadasdasdasdadasdasd
                  </Row>
                  {/*<Row><a>Tra loi</a></Row>*/}
                </Col>
              </Row>
            </Row>
          </Row>
        </Col>
      </Row>
    ):(<div>Không tìm thấy thông báo</div>);
  }
}

export default Index;
