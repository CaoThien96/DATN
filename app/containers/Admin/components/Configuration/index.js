import React, { Component } from 'react';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Styled from 'styled-components';
import Edit from './Edit';
import Input from 'antd/es/input/Input';
const list_config = [
  {
    label:'Địa chỉ email',
    name:'email',
    type:'text',
    default:'caothien029@gmail.com'
  },
  {
    label:'Thời gian làm việc',
    name:'on_time',
    type:'time'
  },
  {
    label:'Thời gian cập nhật model',
    name:'time_update_model',
    type:'time'
  },
  {
    label:'Thời gian tạo phiên giám sát cho mỗi nhân viên',
    name:'time_create_checkin',
    type:'time'
  },
  {
    label:'Điều kiện cảnh báo(số lân đi muộn vượt quá)',
    name:'maxMiss',
    type:'number',
    default:5
  },

]


import EditCustomInput from 'components/EditCustomInput'
import List from 'antd/es/list';
const Span = Styled.span`
     font-size: 20px;
  color:red
`;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: 0,
    };
  }

  onEdit = () => {
    this.setState(prevState => {
      if (prevState.edit) {
        return { ...prevState, edit: 0 };
      }
      return { ...prevState, edit: 1 };
    });
  };

  onSave = () => {
    alert('save');
  };

  render() {
    return (
      <Row>
        <Col span={18} offset={4}>
          <List
            itemLayout="horizontal"
            dataSource={list_config}
            renderItem={item => (
              <List.Item>
                <div style={{width:'100%'}}>
                  <EditCustomInput defaultValue={item.default} label={item.label} name={item.name} typeInput={item.type}></EditCustomInput>
                </div>
              </List.Item>
            )}
          />
          {/*<Row>*/}
            {/*<Span>Thời gian gian làm việc : 8h30</Span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
            {/*<Span>Thời gian tạo các phiên điểm danh</Span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
            {/*<Span>Thời gian tạo model nhận dạng</Span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
            {/*<Span>Thời gian bắt đầu giám sát</Span>*/}
          {/*</Row>*/}
          {/*<Row>*/}
            {/*<Span>Thời gian kết thúc giám sát</Span>*/}
          {/*</Row>*/}
        </Col>
      </Row>
    );
  }
}

export default Index;
