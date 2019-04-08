import React from 'react';
import {
  Checker,
  Dashboard,
  DashboardEmployee,
  EmployeeLayout,
  Attendance,
  RequestLayoutManagement,
  NotificationLayoutManagement,
  Configuration,
  Test,
  ConfigurationModel,
} from 'routes/loadModule';
// import subRoutes from 'containers/Admin/Routes';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
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
    path: '/admin/dashboard-employee',
    key: 'admin-dashboard-employee',
    exact: true,
    component: DashboardEmployee,
    label: 'Dashboard',
    icon: <Icon type="dashboard" />,
  },
  {
    path: '/admin/test',
    key: 'admin-test',
    exact: true,
    component: Test,
    label: 'Test',
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
    // exact: true,
    component: NotificationLayoutManagement,
    label: 'Notification',
    icon: <Icon type="sound" />,
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
    path: '/admin/configuration',
    key: 'admin-configuration',
    exact: true,
    component: Configuration,
    label: 'Configuration',
    icon: <Icon type="setting" />,
  },
  {
    path: '/admin/configuration-model',
    key: 'admin-configuration-model',
    exact: true,
    component: ConfigurationModel,
    label: 'Configuration Model',
    icon: <Icon type="setting" />,
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
