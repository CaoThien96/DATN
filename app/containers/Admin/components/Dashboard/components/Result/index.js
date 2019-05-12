import React, { Component } from 'react';
import Table from 'antd/es/table/Table';
import Badge from 'antd/es/badge';
import Divider from 'antd/es/divider';
// const columns2 = [
//   {
//     title: 'Mã định danh',
//     dataIndex: 'user',
//     width: 150,
//     render: (text, record) => <p>{text.iid}</p>,
//   },
//   {
//     title: 'Email',
//     dataIndex: 'user',
//     width: 200,
//     render: (text, record) => <p>{text.email}</p>,
//   },
//   {
//     title: 'Thời gian',
//     dataIndex: 'updatedAt',
//     width: 200,
//     render: (text, record) => {
//       const d = new Date(text);
//       if (record.status == 0 || record.status == 3) {
//         return <p>Không có dữ liệu</p>;
//       }
//       return <p>{d.toLocaleString()}</p>;
//     },
//
//   },
//   {
//     title: 'Trạng thái',
//     dataIndex: 'status',
//     filteredValue: filteredInfo.address || null,
//     render: (text, record) =>
//       text == 1 ? (
//         <p style={{ color: '#52C41A' }}>Đúng giờ</p>
//       ) : text == 2 ? (
//         <p style={{ color: '#FAAD14' }}>Muộn giờ</p>
//       ) : text == 3 ? (
//         <p >Nghỉ có phép</p>
//       ):(<p style={{ color: 'red' }}>Nghỉ không phép</p>),
//   },
// ];


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
    };
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  render() {
    const { listCheckIn } = this.props;
    let {filteredInfo} = this.state
    filteredInfo = filteredInfo || {};
    const columns2 = [
      {
        title: 'Mã định danh',
        dataIndex: 'iid',
        width: 150,
        render: (text, record) => <p>{record.user.iid}</p>,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: 200,
        render: (text, record) => <p>{record.user.email}</p>,
      },
      {
        title: 'Thời gian',
        dataIndex: 'updatedAt',
        width: 200,
        render: (text, record) => {
          const d = new Date(text);
          if (record.status == 0 || record.status == 3) {
            return <p>Không có dữ liệu</p>;
          }
          return <p>{d.toLocaleString()}</p>;
        },

      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        filters: [
          { text: 'Đúng giờ', value: 1 },
          { text: 'Muộn giờ', value: 2 },
          { text: 'Nghỉ có phép', value: 3 },
          { text: 'Nghỉ không phép', value: 0 },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => {
          console.log(value);
          console.log(record);
          if(record.status == value){
            return true;
          }
          return false
        },
        render: (text, record) =>
          text == 1 ? (
            <p style={{ color: '#52C41A' }}>Đúng giờ</p>
          ) : text == 2 ? (
            <p style={{ color: '#FAAD14' }}>Muộn giờ</p>
          ) : text == 3 ? (
            <p >Nghỉ có phép</p>
          ):(<p style={{ color: 'red' }}>Nghỉ không phép</p>),
      },
    ];

    console.log({ listCheckIn,filteredInfo });
    let success = 0;
    let warning = 0;
    let error = 0;
    let license = 0;
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
        case 3:
          license++;
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
          scroll={{ y: 400 }}
          onChange={this.handleChange}
        />
        <Divider />
        <div>
          <Badge
            status="success"
            text={`Số người đi đúng giờ: ${success} người`}
          />
          <br />
          <Badge status="warning" text={`Số người đi muộn: ${warning} người`} />
          <br />
          <Badge color="#2db7f5" text={`Số người xin phép nghỉ: ${license} người`} />
          <br />
          <Badge status="error" text={`Số người nghỉ: ${error} người`} />
          <br />
        </div>
      </div>
    );
  }
}

export default Index;

