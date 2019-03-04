import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal/Modal';
import Form from 'antd/es/form/Form';

class CheckInManual extends Component {
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

  render() {
    const { checkInManual } = this.props;
    return (
      <div>
        <Modal
          title="Giám sát thủ công"
          visible={checkInManual}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form />
        </Modal>
      </div>
    );
  }
}
CheckInManual.propTypes = {
  checkInManual: PropTypes.bool.isRequired,
};
const WrappedNormalCheckInManual = Form.create({ name: 'CheckInManual' })(
  CheckInManual,
);

export default WrappedNormalCheckInManual;
