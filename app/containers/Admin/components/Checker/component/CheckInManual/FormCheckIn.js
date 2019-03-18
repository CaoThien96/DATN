import React, { Component } from 'react';
import RadioGroup from 'antd/es/radio/group';
import Radio from 'antd/es/radio/radio';

const FormCheckIn =({onChange,value})=>(
  <div>
    <RadioGroup onChange={onChange} value={value}>
      <Radio value={1}>Đúng giờ</Radio>
      <Radio value={2}>Đi muộn</Radio>
    </RadioGroup>
  </div>
)

export default FormCheckIn;
