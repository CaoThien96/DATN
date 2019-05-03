import React, { Component } from 'react';
import Table from 'antd/es/table/Table';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Badge from 'antd/es/badge';
import Button from 'antd/es/button/button';
import Input from 'antd/es/input/Input';
import Icon from 'antd/es/icon';
const ShowDate = props => {
  const created_at = props.created_at;
  if (Array.isArray(created_at)) {
    return (
      <Row>
        <Col span={8}>
          {created_at.slice(0, 9).map((el, key) => {
            const time = new Date(el);
            return (
              <div>
                <Badge
                  status="success"
                  text={`${time.getFullYear()}/${time.getMonth()}/${time.getDate()}`}
                />
              </div>
            );
          })}
        </Col>
        <Col span={8}>
          {created_at.slice(10, 19).map((el, key) => {
            const time = new Date(el);
            return (
              <div>
                <Badge
                  status="success"
                  text={`${time.getFullYear()}/${time.getMonth()}/${time.getDate()}`}
                />
              </div>
            );
          })}
        </Col>
        <Col span={8}>
          {created_at.slice(20).map((el, key) => {
            const time = new Date(el);
            return (
              <div>
                <Badge
                  status="success"
                  text={`${time.getFullYear()}/${time.getMonth()}/${time.getDate()}`}
                />
              </div>
            );
          })}
        </Col>
      </Row>
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
      console.log({value, record});
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

  render() {
    const { result } = this.props;
    const { filteredInfo ,searchText} = this.state;
    console.log(searchText)
    const columns = [
      {
        title: 'Ma so nhân viên',
        dataIndex: '_id',
        key: 'iid',
        render: (text, record) => <p>{record._id.iid}</p>,
      },
      {
        title: 'Địa chỉ email',
        dataIndex: '_id',
        key: 'email',
        render: (text, record) => <p>{record._id.email}</p>,
      },
      {
        title: 'Đúng giờ',
        dataIndex: 'created_at',
        key: 'on_time',
        render: (text, record) => (
          <p>{record && record.created_at.on_time.length}</p>
        ),
      },
      {
        title: 'Đi muộn',
        dataIndex: 'created_at',
        key: 'later',
        render: (text, record) => (
          <p>{record && record.created_at.later.length}</p>
        ),
      },
      {
        title: 'Nghỉ có phép',
        dataIndex: 'created_at',
        key: 'miss_request',
        render: (text, record) => (
          <p>{record && record.created_at.miss_request.length}</p>
        ),
      },
      {
        title: 'Nghỉ không phép',
        dataIndex: 'created_at',
        key: 'miss',
        ...this.getColumnSearchProps(),
        render: (text, record) => {
          return (
            <p>{record && record.created_at.miss.length}</p>
          )
        },
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          // expandedRowRender={record => (
          //   <ShowDate created_at={record.created_at} />
          // )}
          onChange={this.handleChange}
          bordered
          dataSource={result}
        />
      </div>
    );
  }
}

export default Result;
