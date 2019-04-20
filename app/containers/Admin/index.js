import React, { Component } from 'react';
import lodashcommon from 'containers/commons/lodash_commons';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './style.css';
import { Switch, withRouter } from 'react-router-dom';
import adminSubRoutes from 'routes/admin';
import Link from 'react-router-dom/es/Link';
import defineAbilitiesFor from 'containers/casl/abilityForMenu';
import Dropdown from 'antd/es/dropdown/dropdown';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { compose } from 'redux';
import Modal from 'antd/es/modal/Modal';
import firebase from 'firebase';
import notification from 'antd/es/notification';
import Avatar from 'antd/es/avatar';
import RenderRoute from '../../routes/render';
import request from '../../utils/request';
import { makeSelectCurrentUser, makeSelectError } from '../App/selectors';
import { loadUserLogin, removeUser } from '../App/actions';
import injectReducer from '../../utils/injectReducer';
import reducer from './components/Notification/reducer';
import routes_not_menu from '../../routes/admin_routes_not_menu';
import FormChangePassWord from './components/FormChangePassWord';
import commonFirebase from './common';
import {
  askForPermissioToReceiveNotifications,
  initializeFirebase,
  Test
} from '../../push-notification';
import Button from 'antd/es/button/button';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

class LayoutAdmin extends Component {
  constructor(props) {
    super(props);
    this.tokenFirebase = false;
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    this.props.getCurrentUser();
  }

  async componentDidMount() {
    // initializeFirebase();
    // Test();

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
        // [START_EXCLUDE]
        // Update the UI to include the received message.
        // [END_EXCLUDE]
      });
    } catch (e) {
      console.log(e);
    }
  }

  openNotification = (payload) => {
    notification.open({
      message: payload.title,
      description:payload.body,
      icon: <Avatar size="large" src="http://localhost:3000/logo.png" />,
    });
  };

  handleOk = () => {};

  handleCancel = () => {
    this.setState({ visible: false });
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
    this.props.history.replace('/');
  };

  onFormSubmitSuccess = () => {
    this.setState({ visible: false });
    localStorage.removeItem('token');
    this.props.history.replace('/');
  };

  handleOpen = () => {
    this.setState({ visible: true });
  };

  render() {
    const { routes, currentUser, error, history } = this.props;
    if (error) {
      // history.replace('/');
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
    console.log(filter)
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
          <div className="logo" />
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[routerCurrent && routerCurrent.key]}
            defaultOpenKeys={keySubRouterOpen ? [keySubRouterOpen] : []}
            style={{ height: '100%', borderRight: 0 }}
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
                          <Icon type="notification" />
                          {menu && menu.label}
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
                  <Dropdown overlay={menu} trigger={['click']}>
                    <div>
                      <Icon type="notification" />
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
                      <Icon type="smile" theme="twoTone" />
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
            <Breadcrumb style={{ margin: '16px 0' }}>
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
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  error: makeSelectError(),
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(removeUser()),
  getCurrentUser: () => dispatch(loadUserLogin()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
LayoutAdmin.defaultProps = {};
LayoutAdmin.propTypes = {};
export default withRouter(compose(withConnect)(LayoutAdmin));
