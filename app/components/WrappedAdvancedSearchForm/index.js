import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form/Form';
import { Button } from 'antd';

class Wrapper extends Component {
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { handleSearch } = this.props;
    const { getFieldDecorator } = this.props.form;
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { getFieldDecorator }),
    );
    console.log({ getFieldDecorator, childrenWithProps });
    return (
      <div>
        <Form className="ant-advanced-search-form" onSubmit={handleSearch}>
          {childrenWithProps}
          <div className='text-center'>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Clear
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

Wrapper.defaultProps = {
  children: null,
};
Wrapper.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  children: PropTypes.node,
};
const WrapperForm = Form.create({ name: 'wrapper_search_form' })(Wrapper);
export default WrapperForm;
