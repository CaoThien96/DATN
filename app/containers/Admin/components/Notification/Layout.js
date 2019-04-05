import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';
import routes from './routes';
import RenderRoute from 'routes/render';
import injectReducer from '../../../../utils/injectReducer';
import reducer from './reducer';
import { compose } from 'redux';

const LayoutNotificationManagement = ()=>(
  <Switch>
    {routes.map((route, i ) => (
      <RenderRoute key={i} {...route} />
    ))}
  </Switch>
)
LayoutNotificationManagement.defaultProps = {};
LayoutNotificationManagement.propTypes = {};
const withReducer = injectReducer({ key: 'notification', reducer });
export default withRouter(compose(withReducer)(LayoutNotificationManagement));
