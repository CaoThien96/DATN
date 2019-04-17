import React from 'react';
import ReactDOM from 'react-dom';
import { Upload, Button, Icon, message } from 'antd';
import request from 'utils/request';
class Demo extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    formData.append('email', 'caothien@gmail.com');
    this.setState({
      uploading: true,
    });
    request('/api/ai/saveImage', {
      method: 'POST', // or 'PUT'
      body: formData, // data can be `string` or {object}!
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    });
    // You can use any AJAX library you l
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        console.log(file)

        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        console.log(file)
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
    );
  }
}

export default Demo;
