import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';
import Switch from 'antd/es/switch';
import CanWrapper from '../Can';

const Result = ({ items, handleDelete, handleChangeActive }) => {
  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'iid',
      key: 'iid',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'descriptions',
      render(text,record){
        if(text){
          return <div>{`${text.toString().slice(0,20)}....`}</div>
        }
        return <div>Không có dữ liệu</div>
      },
      key: 'descriptions',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render(text, record){
        if(record.status == 0){
          return (
            <div>Đã xóa</div>
          )
        }else {
          return <div>Hoạt động</div>
        }
      },
      key: 'status',
    },
    {
      title: 'Actions',
      render(text, record) {
        const user = {
          role: 1000,
        };
        return (
          <div>
            <CanWrapper I="handle" a="Request" user={user}>
              <Button icon="diff">
                <Link to={`/admin/request/${record && record.iid}`}>
                  Xóa
                </Link>
              </Button>
            </CanWrapper>
            <Button icon="diff">
              <Link to={`/admin/notification/${record && record.iid}`}>
                Xem chi tiết
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
