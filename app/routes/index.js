import React from 'react';
import { AuthLayout, SignIn, SignUp, LayoutAdmin } from 'routes/loadModule';
// import subRoutes from 'containers/Admin/Routes';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
// import Auth from 'containers/Auth';
import adminSubRoutes from './admin';
const routes = [
  {
    path: '/admin',
    // exact: true,
    component: LayoutAdmin,
    routes: adminSubRoutes,
  },
  {
    path: '/',
    component: AuthLayout,
    // exact: true,
    routes: [
      {
        path: '/',
        exact: true,
        component: SignIn,
      },
      {
        path: '/sign-up',
        exact: true,
        component: SignUp,
      },
      {
        path: '',
        component: NotFoundPage,
      },
    ],
  },
  // {
  //   path: '/admin',
  //   component: LayoutAdmin,
  //   employee_routes: subRoutes,
  // },
  // {
  //   path: '/user',
  //   component: Auth,
  //   employee_routes: [
  //     {
  //       path: '/user/signin',
  //       exact: true,
  //       component: SignIn,
  //     },
  //     {
  //       path: '/user/signup',
  //       exact: true,
  //       component: SignUp,
  //     },
  //   ],
  // },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
