import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/es/modal/Modal';
import Form from 'antd/es/form/Form';
import StepFormWrapper from './StepFormWrapper';

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

  onCheckInSuccess = () => {
    this.props.onCheckInManualSuccess();
  };

  render() {
    const { checkInManual,onCheckInManualSuccess } = this.props;
    return (
      <div>
        <Modal title="Giám sát thủ công" visible={checkInManual} footer={null}>
          <StepFormWrapper onCheckInSuccess={this.onCheckInSuccess}/>
        </Modal>
      </div>
    );
  }
}
CheckInManual.propTypes = {
  checkInManual: PropTypes.bool.isRequired,
  onCheckInManualSuccess: PropTypes.func.isRequired,
};
const WrappedNormalCheckInManual = Form.create({ name: 'CheckInManual' })(
  CheckInManual,
);

export default WrappedNormalCheckInManual;
