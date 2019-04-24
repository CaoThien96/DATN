import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectReducer from 'utils/injectReducer';
import Button from 'antd/es/button/button';
import Modal from 'antd/es/modal/Modal';
import WrapperFormSearch from 'components/WrappedAdvancedSearchForm';
import Row from 'antd/es/grid/row';
import Col from 'antd/es/grid/col';
import request from 'utils/request';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import commonFirebase from 'containers/Admin/common';
import CanWrapper from './Can';
import FromNew from './Form/New';
import FormSearch from './Search/Form';
import Result from './Search/Result';
import { makeSelectCurrentUser } from '../../../App/selectors';
class NotificationManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      resultSearch: [],
      valuesSearch: false,
    };
  }

  componentWillMount() {
    console.log('NotificationManagement');
  }

  componentDidMount() {}

  onNewSuccess = async () => {
    this.setState({ visible: false });
    this.handleSearch(this.state.valuesSearch);
    commonFirebase.sendMessageToTopic(
      'employee',
      'Có một một thông báo mới!!',
      '',
    );
  };

  handleSearch = value => {
    try {
      this.setState({ valuesSearch: value });
      const json = JSON.stringify(value);
      const apiUrl = `/api/notification?value=${json}`;
      request(apiUrl)
        .then(data => {
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
    request(`/api/notification/${item.iid}`, {
      method: 'DELETE',
    }).then(data => {
      if (data.success && this.state.valuesSearch) {
        this.handleSearch(this.state.valuesSearch);
      }
    });
    const resultSearch = this.state.resultSearch.filter(i => {
      if (i.iid !== item.iid) {
        return true;
      }
      return false;
    });
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
      this.setState({
        resultSearch,
      });
    });
  };

  render() {
    const user = {
      role: 1000,
    };
    return (
      <div>
        <CanWrapper I="create" a="Notification" user={this.props.currentUser}>
          <Modal
            width={1200}
            title="Tạo thông báo"
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
                Tạo thông báo
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
          currentUser={this.props.currentUser}
        />
      </div>
    );
  }
}

NotificationManagement.defaultProps = {};
NotificationManagement.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);

export default withRouter(compose(withConnect)(NotificationManagement));
