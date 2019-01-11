// import React from 'react';
// import {
//   Employee,
//   EmployeeTraining,
// } from 'routes/loadModule';
// import subRoutes from 'containers/Admin/Routes';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Icon from 'antd/es/icon';
import Loadable from 'react-loadable';
import LoadingIndicator from '../../../../components/LoadingIndicator';
// import Auth from 'containers/Auth';
const Employee = Loadable({
  loader: () => import('containers/Admin/components/Employee/index'),
  loading: LoadingIndicator,
});
const EmployeeTraining = Loadable({
  loader: () => import('containers/Admin/components/Employee/components/Training/index'),
  loading: LoadingIndicator,
})
const routes = [
  {
    path: '/admin/employee',
    key: 'admin-employee-main',
    exact: true,
    component: Employee,
  },
  {
    path: '/admin/employee/training/:id',
    key: 'admin-employee-training',
    exact: true,
    component: EmployeeTraining,
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
