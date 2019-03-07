import React, { Component } from 'react';
import styled from 'styled-components';

const Result = styled.div`
    overflow: auto;
    max-height: -webkit-fill-available;
`
class Preview extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate(){

  }
  componentDidUpdate(){
    const {listFaceDetected} =this.props
    for (let i = 0; i < listFaceDetected.length; i++) {
      this.props.resultTag.current.appendChild(listFaceDetected[i])
    }
  }
  render() {
    return (
      <div>
        <h2 className='text-center'>Preview</h2>
        <Result ref={this.props.resultTag}></Result>
      </div>
    );
  }
}

export default Preview;
