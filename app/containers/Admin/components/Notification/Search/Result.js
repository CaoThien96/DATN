import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';
import Switch from 'antd/es/switch';
import CanWrapper from '../Can';

const Result = ({ items, handleDelete, handleChangeActive, currentUser }) => {
  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'iid',
      key: 'iid',
      render: (text, record) => ({
        props:
          record.status == 0
            ? {
              style: { background: '#FFF1F0' },
            }
            : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => ({
        props:
          record.status == 0
            ? {
              style: { background: '#FFF1F0' },
            }
            : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Chi tiết',
      dataIndex: 'descriptions',
      render(text, record) {
        return {
          props:
            record.status == 0
              ? {
                  style: { background: '#FFF1F0' },
                }
              : {},
          children: text ? (
            <div>{`${text.toString().slice(0, 20)}....`}</div>
          ) : (
            <div>Không có dữ liệu</div>
          ),
        };
      },
      key: 'descriptions',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render(text, record) {
        return {
          props:
            record.status == 0
              ? {
                style: { background: '#FFF1F0' },
              }
              : {},
          children:
            record.status == 0 ? <div>Đã xóa</div> : <div>Hoạt động</div>,
        };
        if (record.status == 0) {
          return <div>Đã xóa</div>;
        }
        return <div>Hoạt động</div>;
      },
      key: 'status',
    },
    {
      title: 'Actions',
      render(text, record) {
        return {
          props:
            record.status == 0
              ? {
                  style: { background: '#FFF1F0' },
                }
              : {},
          children: (
            <div>
              {record.status == 0 ? null : (
                <CanWrapper I="delete" a="Notification" user={currentUser}>
                  <Button onClick={() => handleDelete(record)} icon="delete">
                    Xóa
                  </Button>
                </CanWrapper>
              )}
              <Button icon="diff">
                <Link to={`/admin/notification/${record && record.iid}`}>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          ),
        };
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
