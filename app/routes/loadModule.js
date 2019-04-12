import React from 'react';
import Loadable from 'react-loadable';

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
  loader: () => import('containers/Admin/components/Dashboard/Layout'),
  loading: LoadingIndicator,
});
export const DashboardEmployee = Loadable({
  loader: () => import('containers/Admin/components/DashboardEmployee/index'),
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
});
export const Employee = Loadable({
  loader: () => import('containers/Admin/components/Employee/index'),
  loading: LoadingIndicator,
});

/**
 * Module notification management
 */
export const NotificationLayoutManagement = Loadable({
  loader: () => import('containers/Admin/components/Notification/Layout'),
  loading: LoadingIndicator,
});
/**
 * Module request management
 */
export const RequestLayoutManagement = Loadable({
  loader: () => import('containers/Admin/components/RequestManager/layout'),
  loading: LoadingIndicator,
});
/**
 * Module Attendance
 */
export const Attendance = Loadable({
  loader: () => import('containers/Admin/components/Attendance/index'),
  loading: LoadingIndicator,
});
/**
 * Configuration
 */
export const Configuration = Loadable({
  loader: () => import('containers/Admin/components/Configuration/index'),
  loading: LoadingIndicator,
});
export const ConfigurationModel = Loadable({
  loader: () =>
    import('containers/Admin/components/Configuration_Model/Layout'),
  loading: LoadingIndicator,
});
/**
 * Information
 */
export const Information = Loadable({
  loader: () =>
    import('containers/Admin/components/Infomation/Layout'),
  loading: LoadingIndicator,
});
export const Center = Loadable({
  loader: () =>
    import('containers/Admin/components/Infomation/index'),
  loading: LoadingIndicator,
})
export const ChangePass = Loadable({
  loader: () =>
    import('containers/Admin/components/Infomation/FormChangePassWord'),
  loading: LoadingIndicator,
})
/**
 * Tesst
 */
export const Test = Loadable({
  loader: () => import('containers/Admin/components/TestTf'),
  loading: LoadingIndicator,
});
