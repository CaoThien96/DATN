import React from 'react';
import { Switch } from 'react-router-dom';
import routes from '../Employee/employee_routes';
import RenderRoute from 'routes/render';

const Layout = (props)=>{
  const {routes} = props;
  console.log(routes)
  return (
    <div>
      <Switch>
        {routes.map((route, i) => (
          <RenderRoute key={i} {...route} />
        ))}
      </Switch>
    </div>

  )
}
export default Layout
