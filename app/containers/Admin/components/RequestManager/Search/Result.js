import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';
import Switch from 'antd/es/switch';

const Result = ({ items, handleDelete, handleChangeActive }) => {
  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'iid',
      key: 'iid',
    },
    {
      title: 'Người tạo',
      dataIndex: 'userIid',
      key: 'userIid',
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'descriptions',
      key: 'descriptions',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render(text, record){
        if(record.status == 0){
          return (
            <div>Đang chờ</div>
          )
        }else if (record.status == 1) {
          return (
            <div>Đã chấp nhận</div>
          )
        }else{
          return (
            <div>Bị từ chối</div>
          )
        }
      },
      key: 'status',
    },
    {
      title: 'Actions',
      render(text, record) {
        return (
          <div>
            <Switch
              onChange={status => handleChangeActive(record, status)}
              checkedChildren="Approve"
              unCheckedChildren="Reject"
              checked={record.status == 1?true:false}
            />
            <Button icon="diff">
              <Link to={`request/${record && record.iid}`}>
                Tranning
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="m-t-15">
      <Table dataSource={items} bordered columns={columns} />
    </div>
  );
};

export default Result;
