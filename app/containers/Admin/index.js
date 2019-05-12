import React, { Component } from 'react';
import lodashcommon from 'containers/commons/lodash_commons';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './style.css';
import { Switch, withRouter } from 'react-router-dom';
import Link from 'react-router-dom/es/Link';
import defineAbilitiesFor from 'containers/casl/abilityForMenu';
import Dropdown from 'antd/es/dropdown/dropdown';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { compose } from 'redux';
import firebase from 'firebase';
import notification from 'antd/es/notification';
import Avatar from 'antd/es/avatar';
import Badge from 'antd/es/badge';
import injectSaga from 'utils/injectSaga';
import { getPathImage } from 'common/pathImage';
import RenderRoute from '../../routes/render';
import request from '../../utils/request';
import { makeSelectCurrentUser, makeSelectError } from '../App/selectors';
import { makeSelectNews } from './selectors';
import { loadUserLogin, removeUser,loadUserSuccess } from '../App/actions';
import { updateNews } from './actions';
import injectReducer from '../../utils/injectReducer';
import reducer from './reducer';
import routes_not_menu from '../../routes/admin_routes_not_menu';
import commonFirebase from './common';
import { askForPermissioToReceiveNotifications } from '../../push-notification';
import saga from './saga';
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const menu = props => {
  const { news } = props;
  return (
    <Menu>
      {news &&
        news.map((el, key) => (
          <Menu.Item key={key}>
            <Link
              to={el.action}
              onClick={() => {
                request('/api/news/updateStatus', {
                  method: 'PUT',
                  body: JSON.stringify({
                    iid: el._id,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).then(data => {
                  if (data.success) {
                    props.history.replace(el.action);
                  }
                });
              }}
            >
              <span className="nav-text">{el.title}</span>
            </Link>
          </Menu.Item>
        ))}
    </Menu>
  );
};
const News = props => {
  const { news } = props;
  return (
    <Menu>
      {news &&
        news.map((el, key) => (
          <Menu.Item key={key}>
            {/* <Link */}
            {/* to={el.action} */}
            {/* // onClick={() => { */}
            {/* //   request('/api/news/updateStatus', { */}
            {/* //     method: 'PUT', */}
            {/* //     body: JSON.stringify({ */}
            {/* //       iid: el._id, */}
            {/* //     }), */}
            {/* //     headers: { */}
            {/* //       'Content-Type': 'application/json', */}
            {/* //     }, */}
            {/* //   }).then(data => { */}
            {/* //     if (data.success) { */}
            {/* //       this.props.history.replace(el.action); */}
            {/* //     } */}
            {/* //   }); */}
            {/* // }} */}
            {/* > */}
            {/* <span className="nav-text">{el.title}</span> */}
            {/* </Link> */}
            <span>dsadas</span>
          </Menu.Item>
        ))}
    </Menu>
  );
};
class LayoutAdmin extends Component {
  constructor(props) {
    super(props);
    this.tokenFirebase = false;
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {
    this.props.getCurrentUser();
    console.log('componentWillMount admin')
    this.props.updateNews();
  }

  async componentDidMount() {
    try {
      const token = await askForPermissioToReceiveNotifications();
      this.tokenFirebase = token;
      const { currentUser } = this.props;
      console.log({ token, currentUser });

      if (currentUser.role === 1000) {
        try {
          await commonFirebase.removeOneSubscribedInTopic('employee', token);
          await commonFirebase.addOneSubscribedToTopic('employee', token);
          console.log('Them token to topic employee success!!');
        } catch (e) {
          console.log({ e });
        }
      } else if (currentUser.role === 1001) {
        try {
          await commonFirebase.removeOneSubscribedInTopic('admin', token);
          await commonFirebase.addOneSubscribedToTopic('admin', token);
          console.log('Them token to topic admin success');
        } catch (e) {
          console.log({ e });
        }
      }
      const messaging = firebase.messaging();
      messaging.onMessage(payload => {
        console.log('Message received. ', payload);
        this.openNotification(payload.notification);
      });
    } catch (e) {
      console.log(e);
    }
  }

  openNotification = payload => {
    notification.config({
      placement: 'bottomRight',
      bottom: 50,
      duration: 3,
    });
    notification.open({
      message: payload.title,
      description: payload.body,
      icon: <Avatar size="large" src="http://localhost:3000/logo.png" />,
    });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    const { currentUser } = this.props;
    try {
      if (currentUser.role === 1000) {
        commonFirebase.removeOneSubscribedInTopic(
          'employee',
          this.tokenFirebase,
        );
      } else if (currentUser.role === 1001) {
        commonFirebase.removeOneSubscribedInTopic('admin', this.tokenFirebase);
      }
    } catch (e) {
      console.log({ e });
    }
    this.props.loadUserSuccess(false)
    this.props.history.replace('/');
  };

  render() {
    const { routes, currentUser, error, history } = this.props;
    if(!currentUser){
      return null
    }
    const ability = defineAbilitiesFor(currentUser);
    const filter = lodashcommon.lodashFilter(routes, el =>
      ability.can(el.key, 'Menu'),
    );

    const pathName = this.props.location.pathname;
    const breadcrumbe = pathName.slice(1).split('/');
    let parentPathName = `/${breadcrumbe[0]}`;
    if (breadcrumbe.length > 1) {
      parentPathName = parentPathName.concat('/', breadcrumbe[1]);
    }
    console.log(parentPathName);
    let routerCurrent = lodashcommon.lodashFind(routes, el => {
      if (el.path == parentPathName) {
        return true;
      }
      return false;
    });
    let keySubRouterOpen = false;
    if (routerCurrent.routes && routerCurrent.routes.length) {
      const subRoutesCurrent = lodashcommon.lodashFind(
        routerCurrent.routes,
        el => {
          if (el.path == pathName) {
            return true;
          }
          return false;
        },
      );
      keySubRouterOpen = routerCurrent.key;
      routerCurrent = subRoutesCurrent;

      console.log({ subRoutesCurrent });
    }
    if (routerCurrent.key == 'admin-dashboard') {
      if (currentUser.role != 1001) {
        routerCurrent = filter[0];
        this.props.history.replace(routerCurrent.path);
      }
    }
    console.log(filter);
    let bage = 0;
    this.props.news.forEach(el => {
      if (el.status === 0) {
        bage++;
      }
    });
    getPathImage('1046.jpg');
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          // width={200} style={{ paddingTop: '25px' }}
        >
          <div className="text-center logo">
            <Avatar size={64}>
              <img
                width={64}
                height={64}
                src={getPathImage(currentUser.avatar)}
                alt="user"
              />
            </Avatar>
          </div>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[routerCurrent && routerCurrent.key]}
            defaultOpenKeys={keySubRouterOpen ? [keySubRouterOpen] : []}
            style={{ borderRight: 0 }}
          >
            {filter &&
              filter.map(menu => {
                if (!menu.label) {
                  return false;
                }
                if (menu && menu.label && menu.routes) {
                  return (
                    <SubMenu
                      key={menu && menu.key}
                      title={
                        <span>
                          {menu && menu.icon ? menu.icon : <Icon type="user" />}
                          <span className="nav-text">{menu && menu.label}</span>
                        </span>
                      }
                    >
                      {menu.routes.map(subMenu => (
                        <Menu.Item key={subMenu.key}>
                          <Link to={subMenu.path}>
                            {menu && subMenu.icon ? (
                              subMenu.icon
                            ) : (
                              <Icon type="user" />
                            )}
                            <span className="nav-text">
                              {subMenu && subMenu.label}
                            </span>
                          </Link>
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  );
                }
                return (
                  <Menu.Item key={menu && menu.key}>
                    <Link to={menu.path}>
                      {menu && menu.icon ? menu.icon : <Icon type="user" />}
                      <span className="nav-text">{menu && menu.label}</span>
                    </Link>
                  </Menu.Item>
                );
              })}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <div style={{ float: 'right', marginRight: '15px' }}>
              <Menu
                mode="horizontal"
                // defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="4">
                  <Dropdown overlay={menu(this.props)} trigger={['click']}>
                    <div>
                      <Badge count={bage} showZero>
                        <Icon
                          style={{ fontSize: '25px' }}
                          size="large"
                          type="sound"
                        />
                      </Badge>
                    </div>
                  </Dropdown>
                </Menu.Item>
                <SubMenu
                  onClick={dom => {
                    if (dom.key == 'logout') {
                    }
                  }}
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="user" style={{ fontSize: '25px' }} />
                      {currentUser && currentUser.email.slice(0, 4)}
                    </span>
                  }
                >
                  <Menu.Item key="detail">
                    <Link to="/admin/user">
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="change-password">
                    <Link to="/admin/user/change-password">
                      <span>Thay đổi mật khẩu</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={this.handleLogout}>
                    Đăng xuất
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </div>
          </Header>

          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '5px 0' }}>
              {breadcrumbe.length == 1 ? (
                <Breadcrumb.Item>DASHBOARD</Breadcrumb.Item>
              ) : (
                breadcrumbe.map((el, key) => (
                  <Breadcrumb.Item key={key}>
                    {el.toUpperCase()}
                  </Breadcrumb.Item>
                ))
              )}
            </Breadcrumb>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                // height: '-webkit-fill-available',
              }}
            >
              <Switch>
                {routes_not_menu.map((route, i) => (
                  <RenderRoute key={i} {...route} />
                ))}
                {filter.map((route, i) => (
                  <RenderRoute key={i} {...route} />
                ))}
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Đại Học Bách Khoa Hà Nội ©2019 Created by Cao Thien
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  error: makeSelectError(),
  news: makeSelectNews(),
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(removeUser()),
  getCurrentUser: () => dispatch(loadUserLogin()),
  updateNews: () => dispatch(updateNews()),
  loadUserSuccess: (user)=>dispatch(loadUserSuccess(user))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'admin', reducer });
const withSaga = injectSaga({ key: 'admin', saga });
LayoutAdmin.defaultProps = {};
LayoutAdmin.propTypes = {};
export default withRouter(
  compose(
    withReducer,
    withSaga,
    withConnect,
  )(LayoutAdmin),
);
