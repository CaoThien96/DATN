import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';
import RenderRoute from 'routes/render';
import injectReducer from 'utils/injectReducer';
import { compose } from 'redux';
import reducer from './reducer';
import routes from './routes';
import injectSaga from '../../../../utils/injectSaga';
import saga from './saga';
class LayoutRequestManagement extends Component {
  render() {
    return (
      <div>
        <Switch>
          {routes.map((route, i) => (
            <RenderRoute key={i} {...route} />
          ))}
        </Switch>
      </div>
    );
  }
}

LayoutRequestManagement.defaultProps = {};
LayoutRequestManagement.propTypes = {};
const withReducer = injectReducer({ key: 'request', reducer });
const withSaga = injectSaga({ key: 'request', saga });
export default withRouter(
  compose(
    withReducer,
    withSaga,
  )(LayoutRequestManagement),
);
