import React from 'react';
import Input from 'antd/es/input/Input';
import PropTypes from 'prop-types';
import TimePicker from 'antd/es/time-picker';
import moment from 'moment';
const CustomInput = props => {
  const { inputRef, resultTag, type,value } = props;
  console.log(type)
  console.log(value)
  switch (type) {
    case 'text':
      return (
        <Input
          style={{ width: 'inherit' }}
          ref={inputRef}
          defaultValue={value}
        />
      );
    case 'time':
      return (
        <TimePicker ref={inputRef} defaultValue={moment.unix(value)} format="HH:mm" />
      );
    default:
      return (
        <Input
          style={{ width: 'inherit' }}
          ref={inputRef}
          defaultValue={value}
        />
      );
  }
};
CustomInput.propTypes = {
  inputRef: PropTypes.object.isRequired,
  resultTag: PropTypes.object.isRequired,
};
export default CustomInput;
