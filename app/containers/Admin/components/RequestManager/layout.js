import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { database } from 'containers/commons/firebase';
import Button from 'antd/es/button/button';
import Modal from 'antd/es/modal/Modal';
import WrapperFormSearch from 'components/WrappedAdvancedSearchForm';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import request from 'utils/request';
import { Switch } from 'react-router-dom';
import FromNew from './Form/New';
import FormSearch from './Search/Form';
import Result from './Search/Result';
import routes from './routes';
import RenderRoute from 'routes/render';
class LayoutRequestManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      resultSearch: [],
    };
  }

  componentWillMount() {
    request('/api/request').then(data => {
      console.log({ data });
      this.setState({ resultSearch: data.payload });
    });
  }

  componentDidMount() {
    database.ref('/').on('value', snapshot => {
      console.log('data change', snapshot.val());
    });
  }

  onNewSuccess = () => {
    this.setState({ visible: false });
    request('/api/request').then(data => {
      console.log({ data });
      this.setState({ resultSearch: data.payload });
    });
  };

  handleSearch = value => {
    try {
      const json = JSON.stringify(value);
      const apiUrl = `/api/employee?value=${json}`;
      request(apiUrl)
        .then(data => {
          console.log({ data });
          this.setState({ resultSearch: data });
        })
        .catch(err => alert(err));
    } catch (e) {
      alert(e);
    }
  };

  handleNew = () => {
    this.setState({ visible: true });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleDelete = item => {
    request(`/api/employee/${item.iid}`, {
      method: 'DELETE',
    }).then(data => {});
    const resultSearch = this.state.resultSearch.filter(i => {
      if (i.iid !== item.iid) {
        return true;
      }
      return false;
    });
    alert(JSON.stringify(resultSearch));
    this.setState({
      resultSearch,
    });
  };

  handleChangeActive = (item, status) => {
    request(`/api/request/${item.iid}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(data => {
      const resultSearch = this.state.resultSearch.map(el => {
        const tmp = status ? 1 : 2;
        if (el.iid == item.iid) {
          return {
            ...item,
            status: tmp,
          };
        }
        return el;
      });
      console.log({ resultSearch });
      this.setState({
        resultSearch,
      });
    });
  };

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
