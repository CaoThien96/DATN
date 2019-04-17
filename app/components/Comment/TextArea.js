import React from 'react';
import Row from 'antd/es/grid/row';

export default ({ placeholder, handleOnKeyDown }) => (
  <textarea
    style={{ width: '100%' }}
    placeholder="Nhap binh luan"
    onKeyDown={handleOnKeyDown}
  />
);
