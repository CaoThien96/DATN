import React from 'react';
import Table from 'antd/es/table/Table';
import Badge from 'antd/es/badge';
import Divider from 'antd/es/divider';
const columns2 = [
  {
    title: 'Email',
    dataIndex: 'user',
    width: 250,
    render: (text, record) => <p>{text.email}</p>,
  },
  {
    title: 'Time',
    dataIndex: 'updatedAt',
    width: 250,
    render: (text, record) => {
      const d= new Date(text)
      return (
        <p>{d.toLocaleString()}</p>
      )
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text, record) =>
      text == 1 ? <p style={{ color: '#52C41A' }}>{'Đúng giờ'}</p> : text == 2 ? <p style={{ color: '#FAAD14' }}>{'Muộn giờ'}</p>:<p style={{ color: 'red' }}>{'Nghỉ làm'}</p>,
  },
];

const Result = ({ listCheckIn }) => {
  // const { data } = props;
  console.log({ listCheckIn });
  let success = 0;
  let warning = 0;
  let error = 0;
  for (let i = 0; i < listCheckIn.length; i++) {
    switch (listCheckIn[i].status) {
      case 0:
        error++;
        break;
      case 1:
        success++;
        break;
      case 2:
        warning++;
        break;
    }
  }
  return (
    <div>
      <Table
        bordered
        columns={columns2}
        dataSource={listCheckIn}
        pagination={false}
        scroll={{ y: 240 }}
      />
      <Divider />
      <div>
        <Badge status="success" text={`Số người đi đúng giờ: ${success} người`} />
        <br />
        <Badge status="warning" text={`Số người đi muộn: ${warning} người`} />
        <br />
        <Badge status="error" text={`Số người nghỉ: ${error} người`} />
        <br />
      </div>
    </div>
  );
};
export default Result;
