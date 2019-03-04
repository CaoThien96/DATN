/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import routes from 'routes';
import RenderRoute from 'routes/render';
// import 'antd/dist/antd.css';
import Spin from 'antd/es/spin';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { compose } from 'redux';
import Button from 'antd/es/button/button';
import GlobalStyle from '../../global-styles';
import { makeSelectShowLoading } from './selectors';
// import { mapDispatchToProps } from '../HomePage';
import injectReducer from '../../utils/injectReducer';
import reducer from '../HomePage/reducer';
import { showLoading, hiddenLoading } from './actions';
import { loadUserLogin } from './actions';
import injectSaga from '../../utils/injectSaga';
import saga from './saga';
const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  // padding: 0 16px;
  flex-direction: column;
`;
const SpinWrapper = styled.div`
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
  position: absolute;
  z-index: 9999;
  height: 100%;
  width: 100%;
`;
class Index extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if(token !== null){
      this.props.getCurrentUser();
    }
  }
  render() {
    const { showLoading } = this.props;
    return (
      <AppWrapper>
        <Switch>
          {routes.map((route, i) => (
            <RenderRoute key={i} {...route} />
          ))}
          {/* <Route path="/" exact component={X} /> */}
          {/* <Route path="/y" exact component={Y} /> */}
          {/* <Route path="/z" exact component={Z} /> */}
        </Switch>

        {/* <Link to="/">Home</Link><br/> */}
        {/* <Link to="/y">Employee</Link><br/> */}
        {/* <Link to="/z">Checker</Link><br/> */}
        {/*<Button onClick={this.props.onShowLoading}>Show loading</Button>*/}
        {showLoading && (
          <SpinWrapper>
            <Button onClick={this.props.onHiddenLoading}>Hidden loading</Button>
            <Spin style={{ marginTop: '400px' }} size="large" />
          </SpinWrapper>
        )}
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

Index.defaultProps = {};
Index.propTypes = {};

const mapStateToProps = createStructuredSelector({
  showLoading: makeSelectShowLoading(),
});

const mapDispatchToProps = dispatch => ({
  onShowLoading: () => dispatch(showLoading()),
  onHiddenLoading: () => dispatch(hiddenLoading()),
  getCurrentUser: () => dispatch(loadUserLogin()),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });
export default withRouter(
  compose(
    withReducer,
    withSaga,
    withConnect,
  )(Index),
);
