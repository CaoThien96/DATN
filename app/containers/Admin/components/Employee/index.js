import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button/button';
import Modal from 'antd/es/modal/Modal';
import WrapperFormSearch from 'components/WrappedAdvancedSearchForm';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import request from 'utils/request';
import FromNew from './Form/New';
import FormSearch from './Search/Form';
import Result from './Search/Result';
class LayoutEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      resultSearch: [],
    };
  }

  componentWillMount() {
    // request('/api/employee').then(data => {
    //   console.log({ data });
    //   this.setState({ resultSearch: data });
    // });
  }

  onNewSuccess = () => {
    this.setState({ visible: false });
    request('/api/employee').then(data => {
      this.setState({ resultSearch: data });
    });
  };

  handleSearch = value => {
    try {
      const json = JSON.stringify(value);
      const apiUrl = `/api/employee?value=${json}`;
      request(apiUrl)
        .then(data => {
          this.setState({ resultSearch: data });
        })
        .catch(err => alert(err));
    } catch (e) {
      alert(e);
    }
  };

  handleNew = () => {
    this.setState({ visible: true });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleDelete = item => {
    request(`/api/employee/${item.iid}`, {
      method: 'DELETE',
    }).then(data => {
    });
    const resultSearch = this.state.resultSearch.filter(i => {
      if (i.iid !== item.iid) {
        return true;
      }
      return false;
    });
    alert(JSON.stringify(resultSearch));
    this.setState({
      resultSearch,
    });
  };

  handleChangeActive = (item, status) => {
    request(`/api/employee/${item.iid}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(data => {
      const resultSearch = this.state.resultSearch.map(el => {
        const tmp = status ? 1  :2;
        if (el.iid == item.iid) {
          return {
            ...item,
            status:tmp,
          };
        }
        return el;
      });
      this.setState({
        resultSearch,
      });
    });
  };

  render() {
    return (
      <div>
        <Modal
          title="New Employee"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <FromNew visible={this.state.visible} onSuccess={this.onNewSuccess} />
        </Modal>
        <Row type="flex" justify="end">
          <Col>
            <Button type="primary" onClick={this.handleNew}>
              New
            </Button>
          </Col>
        </Row>
        <WrapperFormSearch handleSearch={this.handleSearch}>
          <FormSearch />
        </WrapperFormSearch>
        <Result
          items={this.state.resultSearch}
          handleDelete={this.handleDelete}
          handleChangeActive={this.handleChangeActive}
        />
        {/* <Button>New Employee</Button> */}
        {/* <Modal */}
        {/* title="Basic Modal" */}
        {/* visible={this.state.visible} */}
        {/* onOk={this.handleOk} */}
        {/* onCancel={this.handleCancel} */}
        {/* > */}
        {/* <p>Some contents...</p> */}
        {/* <p>Some contents...</p> */}
        {/* <p>Some contents...</p> */}
        {/* </Modal> */}
        {/* <FromNew /> */}
      </div>
    );
  }
}

LayoutEmployee.defaultProps = {};
LayoutEmployee.propTypes = {};

export default LayoutEmployee;
