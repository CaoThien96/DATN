import React from 'react';
import {
  Checker,
  Dashboard,
  EmployeeLayout,
  Employee,
  EmployeeTraining,
  Manager,
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
    path: '/admin/checker',
    key: 'admin-checker',
    exact: true,
    component: Checker,
    label: 'Checker',
    icon: <Icon type="clock-circle" />,
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
    path: '/admin/employee',
    key: 'admin-employee',
    // exact: true,
    component: EmployeeLayout,
    label: 'Employee',
    icon: <Icon type="team" />,
    // employee_routes: [
    //   {
    //     path: '/admin/employee',
    //     hidden: true,
    //     key: 'admin-employee-main',
    //     exact: true,
    //     component: Employee,
    //   },
    //   {
    //     path: '/admin/employee/training/:id',
    //     hidden: true,
    //     key: 'admin-employee-training',
    //     exact: true,
    //     component: EmployeeTraining,
    //   },
    // ],
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
