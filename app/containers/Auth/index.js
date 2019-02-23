import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import RenderRoute from 'routes/render';
class LayoutAuth extends Component {
  componentDidMount(){
    console.log(this.props)
    const isLogin = true
    if(isLogin){
      this.props.history.replace('/admin')
    }
  }
  componentDidUpdate(){
    console.log(this.props)
  }
  render() {
    const { routes } = this.props;
    return (
      <div className="display-content">
        <Switch>
          {routes.map((route, i) => (
            <RenderRoute key={i} {...route} />
          ))}
        </Switch>

      </div>
    );
  }
}

LayoutAuth.defaultProps = {};
LayoutAuth.propTypes = {};

export default LayoutAuth;
