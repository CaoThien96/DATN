import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import routes from './routes';
import RenderRoute from 'routes/render';
class LayoutNotificationManagement extends Component {

  render() {
    console.log({routes})
    return (
      <Switch>
        {routes.map((route, i ) => (
          <RenderRoute key={i} {...route} />
        ))}
      </Switch>
    );
  }
}

LayoutNotificationManagement.defaultProps = {};
LayoutNotificationManagement.propTypes = {};

export default LayoutNotificationManagement;
