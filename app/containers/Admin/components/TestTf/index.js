import React, { Component } from 'react';
import Button from 'antd/es/button/button';
import request from 'utils/request'
class Index extends Component {
  createModel = ()=>{

  }
  render() {
    return (
      <div>
        <Button onClick={this.createModel}>Tao model</Button>
      </div>
    );
  }
}

export default Index;
