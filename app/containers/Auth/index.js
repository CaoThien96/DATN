import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import RenderRoute from 'routes/render';
import request from '../../utils/request';
class LayoutAuth extends Component {
  componentWillMount() {
    const token = localStorage.getItem('token')
    if(token !== null){
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
    }else{
      console.log('not found token')
    }


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
