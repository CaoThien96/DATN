import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';

const Result = ({ items, handleDelete }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <Button onClick={() => handleDelete(record)} type="danger">
            Delete
          </Button>
          <Button type="primary">
            <Link to={`employee/training/${record && record.key}`}>Tranning</Link>
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="m-t-15">
      <Table dataSource={items} columns={columns} />
    </div>
  );
};

export default Result;
