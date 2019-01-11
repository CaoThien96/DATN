import React from 'react';
import Loadable from 'react-loadable';

import Loading from 'components/LoadingIndicator';
import LoadingIndicator from '../components/LoadingIndicator';
/**
 * Loading module Auth
 */

export const AuthLayout = Loadable({
  loader: () => import('containers/Auth/index'),
  loading: LoadingIndicator,
});

export const SignIn = Loadable({
  loader: () => import('containers/Auth/SignIn/index'),
  loading: LoadingIndicator,
});
export const SignUp = Loadable({
  loader: () => import('containers/Auth/SignUp/index'),
  loading: LoadingIndicator,
});
/**
 * Admin layout
 */
export const LayoutAdmin = Loadable({
  loader: () => import('containers/Admin/index'),
  loading: LoadingIndicator,
});
export const Dashboard = Loadable({
  loader: () => import('containers/Admin/components/Dashboard/index'),
  loading: LoadingIndicator,
});
export const Checker = Loadable({
  loader: () => import('containers/Admin/components/Checker/index'),
  loading: LoadingIndicator,
});
export const Manager = Loadable({
  loader: () => import('containers/Admin/components/AdminManager/index'),
  loading: LoadingIndicator,
});
/**
 * Module employee
 */
export const EmployeeLayout = Loadable({
  loader: () => import('containers/Admin/components/Employee/Layout'),
  loading: LoadingIndicator,
})
export const Employee = Loadable({
  loader: () => import('containers/Admin/components/Employee/index'),
  loading: LoadingIndicator,
});
export const EmployeeTraining = Loadable({
  loader: () => import('containers/Admin/components/Employee/components/Training/index'),
  loading: LoadingIndicator,
})
