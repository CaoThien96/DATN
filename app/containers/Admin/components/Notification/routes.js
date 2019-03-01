import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Loadable from 'react-loadable';
import LoadingIndicator from '../../../../components/LoadingIndicator';
const NotificationManager = Loadable({
  loader: () => import('containers/Admin/components/Notification/index'),
  loading: LoadingIndicator,
});
const NotificationDetail = Loadable({
  loader: () => import('containers/Admin/components/Notification/component/NotificationDetail'),
  loading: LoadingIndicator,
});
const routes = [
  {
    path: '/admin/notification',
    key: 'admin-notification-main',
    exact: true,
    component: NotificationManager,
  },
  {
    path: '/admin/notification/:id',
    key: 'admin-notification-detail',
    exact: true,
    component: NotificationDetail,
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
