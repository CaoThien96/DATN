import React, { Component } from 'react';

class Test extends Component {
  render() {
    const {children} = this.props
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default Test;
