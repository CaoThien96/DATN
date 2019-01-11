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
import { Switch, Route } from 'react-router-dom';
import routes from 'routes';
import RenderRoute from 'routes/render';
// import 'antd/dist/antd.css';
import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  // padding: 0 16px;
  flex-direction: column;
`;

class Index extends Component {
  render() {
    return (
      <AppWrapper>
        <Switch>
          {routes.map((route, i) => (
            <RenderRoute key={i} {...route} />
          ))}
        </Switch>
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

Index.defaultProps = {};
Index.propTypes = {};

export default Index;
