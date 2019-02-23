import React from 'react';
import {
  Checker,
  Dashboard,
  EmployeeLayout,
  Employee,
  EmployeeTraining,
  Manager,
  Attendance,
  RequestLayoutManagement,
  NotificationLayoutManagement
} from 'routes/loadModule';
// import subRoutes from 'containers/Admin/Routes';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Employ from 'containers/Admin/components/Employee/index';
import Icon from 'antd/es/icon';
// import Auth from 'containers/Auth';
const routes = [
  {
    path: '/admin',
    key: 'admin-dashboard',
    exact: true,
    component: Dashboard,
    label: 'Dashboard',
    icon: <Icon type="dashboard" />,
  },

  {
    path: '/admin/employee',
    key: 'admin-employee',
    // exact: true,
    component: EmployeeLayout,
    label: 'Employee',
    icon: <Icon type="team" />,
  },
  {
    path: '/admin/request',
    key: 'admin-request',
    component: RequestLayoutManagement,
    label: 'Request',
    icon: <Icon type="clock-circle" />,
  },
  {
    path: '/admin/notification',
    key: 'admin-notification',
    exact: true,
    component: NotificationLayoutManagement,
    label: 'Notification',
    icon: <Icon type="sound" />,
  },
  {
    path: '/admin/manager',
    key: 'admin-manager',
    exact: true,
    component: Manager,
    label: 'Manager',
    icon: <Icon type="user" />,
  },
  {
    path: '/admin/checker',
    key: 'admin-checker',
    exact: true,
    component: Checker,
    label: 'Checker',
    icon: <Icon type="clock-circle" />,
  },
  {
    path: '/admin/attendance',
    key: 'admin-attendance',
    exact: true,
    component: Attendance,
    label: 'Attendance',
    icon: <Icon type="search" />,
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
