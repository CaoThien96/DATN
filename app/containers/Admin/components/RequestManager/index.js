import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { database } from 'containers/commons/firebase';
import { Can } from '@casl/react';

import { AbilityBuilder } from '@casl/ability';
import Button from 'antd/es/button/button';
import Modal from 'antd/es/modal/Modal';
import WrapperFormSearch from 'components/WrappedAdvancedSearchForm';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import request from 'utils/request';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import FromNew from './Form/New';
import FormSearch from './Search/Form';
import Result from './Search/Result';
import { makeSelectCurrentUser } from '../../../App/selectors';
import CanWrapper from './Can';
class RequestManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      resultSearch: [],
    };
  }

  componentWillMount() {
    request('/api/request').then(data => {
      this.setState({ resultSearch: data.payload });
    });
  }

  componentDidMount() {
    database.ref('/').on('value', snapshot => {});
  }

  onNewSuccess = () => {
    this.setState({ visible: false });
    request('/api/request').then(data => {
      this.setState({ resultSearch: data.payload });
    });
  };

  handleSearch = value => {
    try {
      const json = JSON.stringify(value);
      const apiUrl = `/api/request?value=${json}`;
      request(apiUrl)
        .then(data => {
          console.log(data);
          this.setState({ resultSearch: data.payload });
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
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
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
            status
          };
        }
        return el;
      });

      this.setState({
        resultSearch,
      });
    });
  };

  render() {

    return (
      <div>
        <CanWrapper I="create" a="Request" user={this.props.currentUser}>
          <Modal
            title="New Request"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <FromNew onSuccess={this.onNewSuccess} />
          </Modal>
          <Row type="flex" justify="end">
            <Col>
              <Button type="primary" onClick={this.handleNew}>
                Tạo yêu cầu
              </Button>
            </Col>
          </Row>
        </CanWrapper>
        <WrapperFormSearch handleSearch={this.handleSearch}>
          <FormSearch />
        </WrapperFormSearch>
        <Result
          items={this.state.resultSearch}
          handleDelete={this.handleDelete}
          handleChangeActive={this.handleChangeActive}
          user={this.props.currentUser}
        />
      </div>
    );
  }
}

RequestManagement.defaultProps = {};
RequestManagement.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});
const withConnect = connect(mapStateToProps);
export default withRouter(compose(withConnect)(RequestManagement));
// export default RequestManagement;
