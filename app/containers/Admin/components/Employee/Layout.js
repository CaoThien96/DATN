import React from 'react';
import RenderRoute from 'routes/render';
import { Switch } from 'react-router-dom';
import routes from './employee_routes';
const Layout = () => {
  if (routes) {
    return (
      <Switch>
        {routes.map((route, i) => (
          <RenderRoute key={i} {...route} />
        ))}
      </Switch>
    );
  }
  return null;
};

export default Layout;
