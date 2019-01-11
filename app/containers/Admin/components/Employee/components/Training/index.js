import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import Guild from './Guild'
import Training from './Training'
class Index extends Component {
  render() {
    return (
      <div>
        {this.props.match.params.id}
        <Row>
          <Col span={12}><Training/></Col>
          <Col span={12}><Guild/></Col>
        </Row>
      </div>
    );
  }
}

Index.defaultProps = {};
Index.propTypes = {};

export default Index;
