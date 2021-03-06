import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import List from 'antd/es/list';
import Avatar from 'antd/es/avatar';
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import request from 'utils/request';
import { makeSelectCurrentUser } from '../../../../App/selectors';
import { makeSelectListCheckIn, makeSelectPredict } from '../seclectors';
import { onUpdateListCheckIn } from '../actions';
import { getPathImage } from '../../../../../common/pathImage';

const ResultWarapper = styled.div`
  padding: 0px 10px;
`;
const StatusOnTime = styled.span`
  margin: 0px 5px;
  box-shadow: 0px 0px 10px 0px #3167a4;
  color: #3167a4;
`;
class Result extends Component {
  constructor(props) {
    super(props);
    this.scrollTag = React.createRef();
  }

  componentWillMount() {
    request('/api/check-in/list-check-in-success').then(data => {
      console.log(data);

      this.props.onUpdateListCheckIn(data.listCheckSuccess);
    });
  }

  componentDidMount() {
    this.scrollTag.current.scrollTop = this.scrollTag.current.scrollHeight;
  }

  render() {
    const { listCheckInV2 } = this.props;
    return (
      <ResultWarapper>
        <div
          ref={this.scrollTag}
          style={{
            maxHeight: '550px',
            overflow: 'auto',
            boxShadow: '0px 0px 10px 0px #888888',
          }}
        >
          {listCheckInV2.map((el, key) => {
            return (
              <div key={key}>
                <List.Item key={el.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={getPathImage(el.user.avatar)} />
                    }
                    title={<a href="#">{el.user.email}</a>}
                    description={new Date(el.updatedAt).toLocaleString('en-US', {
                      timeZone: 'Asia/Jakarta',
                    })}
                  />
                  <Button style={{ marginRight: '5px' }} type="primary">
                    {el.status == 1
                      ? 'Đúng giờ'
                      : el.status == 2
                        ? 'Đi muộn'
                        : 'Có phép'}
                  </Button>
                </List.Item>
                <Divider style={{ margin: '0px', padding: '0px' }} />
              </div>
            )
          })}
        </div>
      </ResultWarapper>
    );
  }
}

Result.propTypes = {};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  listCheckInV2: makeSelectListCheckIn(),
});

const mapDispatchToProps = dispatch => ({
  onUpdateListCheckIn: payload => dispatch(onUpdateListCheckIn(payload)),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default withRouter(compose(withConnect)(Result));
