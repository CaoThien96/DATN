import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/es/button/button';
import Modal from 'antd/es/modal/Modal';
import WrapperFormSearch from 'components/WrappedAdvancedSearchForm';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
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
    this.setState({
      resultSearch: [
        {
          key: '1',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
      ],
    });
  }

  handleSearch = () => {
    alert('search');
  };

  handleNew = () => {
    this.setState({ visible: true });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleDelete = item => {

    const resultSearch = this.state.resultSearch.filter(i => {
      if (i.key !== item.key) {
        return true;
      }else {
        return false
      }
    });
    alert(JSON.stringify(resultSearch))
    this.setState({
      resultSearch,
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
          <FromNew onSuccess={() => this.setState({ visible: false })} />
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
