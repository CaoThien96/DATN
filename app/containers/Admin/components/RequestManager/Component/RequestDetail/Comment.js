import React from 'react'
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
const Comment  = (props) =>{
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={<a href="#">{item.u.email}</a>}
              description={item.content}
            />
          </List.Item>
        )}
      />
    </div>
  )
}
export default Comment
