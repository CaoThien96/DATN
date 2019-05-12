import React, { Component } from 'react';
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
import { getPathImage } from '../../../../../../common/pathImage';
import Modal from 'antd/es/modal/Modal';

class User extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    const {user} = this.props
    return (
      <div>
        <Modal
          title="Thông tin nhân viên"
          visible={this.state.visible}
          onOk={this.handleOk}
          footer={false}
          onCancel={this.handleCancel}
        >
          <p>{`Mã định danh: ${user.iid}`}</p>
          <p>{`Email: ${user.email}`}</p>
          <p>{`Tên đầy đủ: ${user.full_name}`}</p>
        </Modal>
        <List.Item key={user.iid}>
          <List.Item.Meta
            avatar={
              <Avatar src={getPathImage(user.avatar)} />
            }
            title={<a href="#" onClick={this.showModal}>{user.email}</a>}
          />
        </List.Item>
      </div>
    );
  }
}

export default User;
