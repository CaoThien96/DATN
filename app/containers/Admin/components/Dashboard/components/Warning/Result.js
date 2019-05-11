import React, { Component } from 'react';
import moment from 'moment';
import Table from 'antd/es/table/Table';
import Badge from 'antd/es/badge';
import Button from 'antd/es/button/button';
import Input from 'antd/es/input/Input';
import Icon from 'antd/es/icon';
import Calendar from 'antd/es/calendar';
import './style.css';
const getMatch = (
  time1 = moment(),
  time2 = { created_at: '2019-05-01T09:21:00.126Z', status: 2 },
) => {
  let check = false;
  const timeTmp = new Date(time2.created_at);
  if (time1.date() === timeTmp.getDate()) {
    check = true;
  }
  if (check) {
    switch (time2.status) {
      case 0:
        return <Badge status="error" text="Nghỉ làm" />;
        break;
      case 1:
        return <Badge status="success" text="Đúng giờ" />;
      case 2:
        return <Badge status="warning" text="Muộn giờ" />;
      case 3:
        return <Badge status="warning" text="Xin nghỉ có phép" />;
      default:
        return null;
    }
  } else {
    return null;
  }
};
const getRender = (
  time = moment(),
  arrayTime = [{ created_at: '2019-05-01T09:21:00.126Z', status: 2 }],
) => {
  let render = null;
  arrayTime.forEach(el => {
    const tmp = getMatch(time, el);
    if (tmp) {
      render = tmp;
    }
  });
  return render;
};
const dateRenderCell = (time, created_at) => {
  let result = null;
  result = getRender(time, created_at.on_time);
  if (result) return result;
  result = getRender(time, created_at.later);
  if (result) return result;
  result = getRender(time, created_at.miss);
  if (result) return result;
  result = getRender(time, created_at.miss_request);
  return result;
};
const ShowDate = props => {
  const created_at = props.created_at;
  console.log({ created_at });
  if (created_at) {
    return (
      <Calendar
        dateCellRender={time => dateRenderCell(time, created_at)}
        mode="month"
      />
    );
  }
  console.log('no');

  return null;
};

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: null,
      searchText: false,
      sortedInfo: null,
    };
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  getColumnSearchProps = (dataIndex = 'key') => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      console.log({ value, record });
      if (record.created_at.miss.length > parseInt(value)) {
        return true;
      }
      return false;
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => <div>{text}</div>,
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleRowSelection = (record, selected, selectedRows, nativeEvent) => {
    console.log({ record, selected, selectedRows, nativeEvent });
  };

  render() {
    const { result } = this.props;
    let { filteredInfo, searchText, sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    console.log(searchText);
    const columns = [
      {
        title: 'Mã số nhân viên',
        dataIndex: '_id',
        key: 'iid',
        render: (text, record) => <p>{record._id.iid}</p>,
      },
      {
        title: 'Địa chỉ email',
        dataIndex: '_id',
        key: 'email',
        sorter: (a, b) =>
          a._id.email.length - b._id.email.length,
        // sortDirections: 'descend',
        defaultSortOrder:'descend',
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        render: (text, record) => <p>{record._id.email}</p>,
      },
      {
        title: 'Đúng giờ(lần)',
        dataIndex: 'created_at',
        key: 'on_time',
        sorter: (a, b) =>
          a.created_at.on_time.length - b.created_at.on_time.length,
        sortOrder: sortedInfo.columnKey === 'on_time' && sortedInfo.order,
        render: (text, record) => (
          <p>{record && record.created_at.on_time.length?(<Badge status="success" text={record.created_at.miss.length} />):(<Badge status="success" text={0} />)}</p>
        ),
      },
      {
        title: 'Nghỉ có phép(lần)',
        dataIndex: 'created_at',
        key: 'miss_request',
        sorter: (a, b) =>
          a.created_at.miss_request.length - b.created_at.miss_request.length,
        sortOrder: sortedInfo.columnKey === 'miss_request' && sortedInfo.order,
        render: (text, record) => (
          <p>{record && record.created_at.miss_request.length ? (<Badge status="default" text={record.created_at.miss_request.length} />):<Badge status="default" text={0} />}</p>
        ),
      },
      {
        title: 'Đi muộn(lần)',
        dataIndex: 'created_at',
        key: 'later',
        sorter: (a, b) => a.created_at.later.length - b.created_at.later.length,
        sortOrder: sortedInfo.columnKey === 'later' && sortedInfo.order,
        render: (text, record) => (
          <p>{record && record.created_at.later.length ? (<Badge status="warning" text={record.created_at.miss.length} />):(<Badge status="warning" text={0} />)}</p>
        ),
      },

      {
        title: 'Nghỉ không phép(lần)',
        dataIndex: 'created_at',
        key: 'miss',
        sorter: (a, b) => a.created_at.miss.length - b.created_at.miss.length,
        sortOrder: sortedInfo.columnKey === 'miss' && sortedInfo.order,
        // ...this.getColumnSearchProps(),
        render: (text, record) => (
          <p>{record && record.created_at.miss.length ? (<Badge status="error" text={record.created_at.miss.length} />):(<Badge status="error" text={0} />)}</p>
        ),
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          expandedRowRender={record => (
            <ShowDate created_at={record.created_at} />
          )}
          onChange={this.handleChange}
          // rowSelection={
          //   {onSelect:this.handleRowSelection}
          // }
          bordered
          dataSource={result}
        />
      </div>
    );
  }
}

export default Result;
