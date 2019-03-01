import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import routes from './routes';
import RenderRoute from 'routes/render';
class LayoutRequestManagement extends Component {
  render() {
    return (
      <Switch>
        {routes.map((route, i) => (
          <RenderRoute key={i} {...route} />
        ))}
      </Switch>
    );
  }
}

LayoutRequestManagement.defaultProps = {};
LayoutRequestManagement.propTypes = {};

export default LayoutRequestManagement;
