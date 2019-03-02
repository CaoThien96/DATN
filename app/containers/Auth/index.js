import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import RenderRoute from 'routes/render';
import request from '../../utils/request';
class LayoutAuth extends Component {
  componentWillMount() {
    console.log(this.props)
    const token = localStorage.getItem('token')
    request('api/get-current-user', {
      method: 'GET',
      headers: new Headers({
        authorization: token,
      }),
    })
      .then(data => {
        this.props.history.replace('/admin');
      })
      .catch(e => {

      });
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
