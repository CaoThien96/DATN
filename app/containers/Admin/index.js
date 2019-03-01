import React, { Component } from 'react';
import lodashcommon from 'containers/commons/lodash_commons';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './style.css';
import { Switch } from 'react-router-dom';
import adminSubRoutes from 'routes/admin';
import Link from 'react-router-dom/es/Link';
import defineAbilitiesFor from 'containers/casl/abilityForMenu';
import RenderRoute from '../../routes/render';
import Dropdown from 'antd/es/dropdown/dropdown';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;
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
  render() {
    const { routes } = this.props;
    const ability = defineAbilitiesFor({ role: 1001 });
    const filter = lodashcommon.lodashFilter(routes, el =>
      ability.can(el.key, 'Menu'),
    );
    console.log({ routes });
    const pathName = this.props.location.pathname;
    const breadcrumbe = pathName.slice(1).split('/');
    let parentPathName = `/${breadcrumbe[0]}`;
    if (breadcrumbe.length > 1) {
      parentPathName = parentPathName.concat('/', breadcrumbe[1]);
    }
    console.log(parentPathName);
    const routerCurrent = lodashcommon.lodashFind(routes, el => {
      if (el.path == parentPathName) {
        return true;
      }
      return false;
    });
    return (
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="logo" />
          <div style={{ float: 'right',marginRight:'15px' }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="4">
                <Dropdown overlay={menu} trigger={['click']}>
                  <div><Icon type="notification" /></div>
                </Dropdown>
              </Menu.Item>
              <SubMenu onClick={()=>alert('dấd')}  title={<span className="submenu-title-wrapper"><Icon type="smile" theme="twoTone" />Cao</span>}>
                <MenuItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu>
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{paddingTop: '25px' }}>
            <Menu
              mode="inline"
              theme={'dark'}
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
                margin: 0,
                minHeight: 280,
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

LayoutAdmin.defaultProps = {};
LayoutAdmin.propTypes = {};

export default LayoutAdmin;
