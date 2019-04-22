import { Route } from 'react-router-dom';
import React from 'react';

export default function RouteWithSubRoutes(route) {
  console.log(route)
  return (
    <Route
      path={route.path}
      exact={route && route.exact}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}
