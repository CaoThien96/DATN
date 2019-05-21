import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';
import Switch from 'antd/es/switch';
import CanWrapper from '../Can';
const Result = ({ items, handleDelete, handleChangeActive,user }) => {
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
            : record.status == 2
            ? { style: { background: '#FFFBE6' } }
            : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => ({
        props:
          record.status == 0
            ? {
              style: { background: '#FFF1F0' },
            }
            : record.status == 2
            ? { style: { background: '#FFFBE6' } }
            : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => ({
        props:
          record.status == 0
            ? {
              style: { background: '#FFF1F0' },
            }
            : record.status == 2
              ? { style: { background: '#FFFBE6' } }
              : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => ({
        props:
          record.status == 0
            ? {
              style: { background: '#FFF1F0' },
            }
            : record.status == 2
            ? { style: { background: '#FFFBE6' } }
            : {},
        children: <p>{text}</p>,
      }),
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
              : record.status == 2
              ? { style: { background: '#FFFBE6' } }
              : {},
          children:
            record.status == 0 ? (
              <div>Deleted</div>
            ) : (
              <div>
                <CanWrapper I="change-status" user={user} a="Employee">
                  <Switch
                    onChange={status => handleChangeActive(record, status)}
                    checkedChildren="Active"
                    unCheckedChildren="Unlock"
                    checked={record.status == 1}
                  />
                </CanWrapper>
                <CanWrapper I="delete" user={user} a="Employee">
                  <Button
                    onClick={() => handleDelete(record)}
                    type="danger"
                    icon="delete"
                  >
                    Delete
                  </Button>
                </CanWrapper>
                <Button icon="diff">
                  <Link to={`employee/training/${record && record.iid}`}>
                    Tranning
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
