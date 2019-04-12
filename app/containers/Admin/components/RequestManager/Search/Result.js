import React from 'react';
import Table from 'antd/es/table/Table';
import Button from 'antd/es/button/button';
import Link from 'react-router-dom/es/Link';
import Switch from 'antd/es/switch';
import Select from 'antd/es/select';
import CanWrapper from '../Can';
const Option = Select.Option;
const Result = ({ items, handleDelete, handleChangeActive, user }) => {
  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'iid',
      key: 'iid',
      render: (text, record) => ({
        props:
          record.status == 1
            ? {
              style: { background: '#E6F7FF' },
            }
            : record.status == 2
              ? { style: { background: '#FFF1F0' } }
              : record.status == 3
                ? { style: { background: '#FFFBE6' } }
                : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Người tạo',
      dataIndex: 'u',
      key: 'userIid',
      render: (text, record) => ({
        props:
          record.status == 1
            ? {
              style: { background: '#E6F7FF' },
            }
            : record.status == 2
              ? { style: { background: '#FFF1F0' } }
              : record.status == 3
                ? { style: { background: '#FFFBE6' } }
                : {},
        children: <p>{text && text.email}</p>,
      }),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => ({
        props:
          record.status == 1
            ? {
              style: { background: '#E6F7FF' },
            }
            : record.status == 2
              ? { style: { background: '#FFF1F0' } }
              : record.status == 3
                ? { style: { background: '#FFFBE6' } }
                : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Lí do',
      dataIndex: 'descriptions',
      key: 'descriptions',
      render: (text, record) => ({
        props:
          record.status == 1
            ? {
              style: { background: '#E6F7FF' },
            }
            : record.status == 2
              ? { style: { background: '#FFF1F0' } }
              : record.status == 3
                ? { style: { background: '#FFFBE6' } }
                : {},
        children: <p>{text}</p>,
      }),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render:(text,record)=>{
        return {
          props:
            record.status == 1
              ? {
                style: { background: '#E6F7FF' },
              }
              : record.status == 2
              ? { style: { background: '#FFF1F0' } }
              : record.status == 3
                ? { style: { background: '#FFFBE6' } }
                : {},
          children: record.status == 0 ?(<p>Đang chờ</p>):record.status ==1 ?(<p>Đã chấp nhận</p>):record.status ==2?(<p>Từ chối</p>):(<p>Hủy bỏ yêu cầu</p>)
        }

      },
      // render(text, record) {
      //   console.log({ status: record.status });
      //   if (record.status == 0) {
      //     return <div>Đang chờ</div>;
      //   }
      //   if (record.status == 1) {
      //     return <div>Đã chấp nhận</div>;
      //   }
      //   if (record.status == 2) {
      //     return <div>Từ chối</div>;
      //   }
      //   return <div>Hủy bỏ yêu cầu</div>;
      // },
      key: 'status',
    },
    {
      title: 'Actions',
      render(text, record) {
        return (
          <div>
            {record.status !== 3 ? (
              <CanWrapper I="handle" a="Request" user={user}>
                {/* <Switch */}
                {/* onChange={status => handleChangeActive(record, status)} */}
                {/* checkedChildren="Approve" */}
                {/* unCheckedChildren="Reject" */}
                {/* checked={record.status == 1} */}
                {/* /> */}
                {record.status == 0 ? (
                  <Select
                    style={{ width: '150px' }}
                    placeholder="Handle request"
                    onChange={status => handleChangeActive(record, status)}
                  >
                    <Option value="1">Accept</Option>
                    <Option value="2">Reject</Option>
                  </Select>
                ) : (
                  <span>
                    <Select
                      style={{ width: '150px' }}
                      placeholder="Handle request"
                      onChange={status => handleChangeActive(record, status)}
                      defaultValue={record.status.toString()}
                    >
                      <Option value="1">Accept</Option>
                      <Option value="2">Reject</Option>
                    </Select>
                  </span>
                )}
              </CanWrapper>
            ) : null}

            <Button icon="diff">
              <Link to={`/admin/request/${record && record.iid}`}>
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
