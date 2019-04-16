import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';
import RenderRoute from 'routes/render';
import injectReducer from 'utils/injectReducer';
import { compose } from 'redux';
import reducer from './reducer';
import routes from './routes';
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
const withReducer = injectReducer({ key: 'request', reducer });
export default withRouter(compose(withReducer)(LayoutRequestManagement));
