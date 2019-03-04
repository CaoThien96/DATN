import React, { Component } from 'react';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.videoTag.current.srcObject = stream;
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
    //   .then(stream => {
    //     console.log(stream);
    //     console.log(this.videoTag);
    //     this.videoTag.current.src = stream;
    //   })
    //   .catch(err => console.log(err));
  }

  onPlay = () => {
    if (this.videoTag.current.paused || this.videoTag.current.ended)
      return setTimeout(() => this.onPlay());
  };
  grabFrame = ()=>{

  }
  onGrabFrame = ()=>{

  }
  render() {
    return (
      <div>
        <video
          // style={{ position: 'absolute' }}
          onPlay={this.onPlay}
          ref={this.videoTag}
          width="640"
          height="480"
          controls
          autoPlay
          muted
        />
      </div>
    );
  }
}

export default Camera;
