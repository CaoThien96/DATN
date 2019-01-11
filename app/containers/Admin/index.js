import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './style.css';
import { Switch } from 'react-router-dom';
import adminSubRoutes from 'routes/admin';
import Link from 'react-router-dom/es/Link';
import RenderRoute from '../../routes/render';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
class LayoutAdmin extends Component {
  render() {
    const { routes } = this.props;
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff', paddingTop: '25px' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              {adminSubRoutes &&
                adminSubRoutes.map(menu => {
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
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
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
                {routes.map((route, i) => (
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
