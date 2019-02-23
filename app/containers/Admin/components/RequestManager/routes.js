import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Loadable from 'react-loadable';
import LoadingIndicator from '../../../../components/LoadingIndicator';
const RequestManager = Loadable({
  loader: () => import('containers/Admin/components/RequestManager/index'),
  loading: LoadingIndicator,
});
const RequestDetail = Loadable({
  loader: () => import('containers/Admin/components/RequestManager/Component/RequestDetail'),
  loading: LoadingIndicator,
});
const routes = [
  {
    path: '/admin/request',
    key: 'admin-request-main',
    exact: true,
    component: RequestManager,
  },
  {
    path: '/admin/request/:id',
    key: 'admin-request-detail',
    exact: true,
    component: RequestDetail,
  },
  {
    path: '',
    component: NotFoundPage,
  },
];
export default routes;
