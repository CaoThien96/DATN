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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Actions',
      render(text, record) {
        return {
          props:
            record.status == 0
              ? {
                style: { background: '#f70707' },
              }
              : {},
          children:
            record.status == 0 ? (
              <div>Deleted</div>
            ) : (
              <div>
                <Switch
                  onChange={status => handleChangeActive(record, status)}
                  checkedChildren="Active"
                  unCheckedChildren="Unlock"
                  checked={record.status == 1?true:false}
                />
                <Button
                  onClick={() => handleDelete(record)}
                  type="danger"
                  icon="delete"
                >
                  Delete
                </Button>
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
