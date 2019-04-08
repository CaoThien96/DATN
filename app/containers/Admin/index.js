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
import RenderRoute from '../../routes/render';
import request from '../../utils/request';
import { makeSelectCurrentUser, makeSelectError } from '../App/selectors';
import { loadUserLogin, removeUser } from '../App/actions';
import injectReducer from '../../utils/injectReducer';
import reducer from './components/Notification/reducer';
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
const LayoutResponsive = () => (
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
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1">
          <Icon type="user" />
          <span className="nav-text">nav 1</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="video-camera" />
          <span className="nav-text">nav 2</span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="upload" />
          <span className="nav-text">nav 3</span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="user" />
          <span className="nav-text">nav 4</span>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header style={{ background: '#fff', padding: 0 }} />
      <Content style={{ margin: '24px 16px 0' }}>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          content
        </div>
      </Content>
    </Layout>
  </Layout>
);
class LayoutAdmin extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token');
    this.props.getCurrentUser();
  }

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
    console.log(parentPathName)
    let routerCurrent = lodashcommon.lodashFind(routes, el => {
      if (el.path == parentPathName) {
        return true;
      }
      return false;
    });
    console.log(routerCurrent)
    console.log({filter})
    if(routerCurrent.key=='admin-dashboard'){

      if(currentUser.role != 1001){
        routerCurrent = filter[0]
        this.props.history.replace(routerCurrent.path);
      }
    }
    return (
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <div className="logo" />
          <div style={{ float: 'right', marginRight: '15px' }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
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
                    localStorage.removeItem('token');
                    this.props.history.replace('/');
                  }
                }}
                title={
                  <span className="submenu-title-wrapper">
                    <Icon type="smile" theme="twoTone" />
                    {currentUser && currentUser.email.slice(0, 4)}
                  </span>
                }
              >
                <Menu.Item key="logout">Đăng xuất</Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        </Header>
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
            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={[routerCurrent.key]}
              // defaultOpenKeys={['sub1']}
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
                          <Link to={menu.path}>
                            <span>
                              <Icon type="notification" />
                              {menu && menu.label}
                            </span>
                          </Link>
                        }
                      />
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
