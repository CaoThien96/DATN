import React from 'react';
import {
  Information,
} from 'routes/loadModule';
// import subRoutes from 'containers/Admin/Routes';
import Icon from 'antd/es/icon';
// import Auth from 'containers/Auth';
const routes = [
  {
    path: '/admin/information/:id',
    key: 'admin-information',
    exact: true,
    component: Information,
    hidden: true,
    label: 'Configuration Model',
    icon: <Icon type="setting" />,
  },
];
export default routes;
