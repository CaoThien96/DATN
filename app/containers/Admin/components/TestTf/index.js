import React from 'react';
import { askForPermissioToReceiveNotifications } from 'push-notification';
import { Badge } from 'antd';
import notification from 'antd/es/notification';
import Avatar from 'antd/es/avatar';
import Button from 'antd/lib/button/button';
import commonFirebase from 'containers/Admin/common';
function openNotification (payload={title:'title',body:'hello world'})  {
  notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
  });
  commonFirebase.sendMessageToTopic('admin','gui admin','hello world')
  notification.open({
    message: payload.title,
    description: payload.body,
    icon: <Avatar size="large" src="http://localhost:3000/logo.png" />,
  });
};
const NotificationButton = () => (
  <div>
    <Button onClick={openNotification}>Send Message</Button>
  </div>
);
export default NotificationButton;
