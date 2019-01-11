import React from 'react';
import List from 'antd/es/list';
const data = [
  'Nhan vien dung truoc va dieu chinh sao cho chinh giua camera',
  'An nut Start de bat dau qua trinh tranning',
  'Sau khi thu thap du du lieu co thong bao ket thuc tranning',
  'Test ket qua nhan dien',
];
const Guild = () => (
  <div>
    <List
      header={<div style={{color:'red',fontSize:'20px'}}>Huong dan training</div>}
      bordered
      dataSource={data}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  </div>
);

export default Guild;
