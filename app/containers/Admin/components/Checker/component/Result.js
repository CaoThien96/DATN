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
import { makeSelectCurrentUser } from '../../../../App/selectors';
import { makeSelectListCheckIn, makeSelectPredict } from '../seclectors';

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

  componentDidMount() {
    this.scrollTag.current.scrollTop = this.scrollTag.current.scrollHeight;
  }

  render() {
    const { listCheckIn, listCheckInV2 } = this.props;
    return (
      <ResultWarapper>
        {/* <List */}
        {/* dataSource={listCheckIn} */}
        {/* renderItem={item => ( */}
        {/* <List.Item key={item.id}> */}
        {/* <List.Item.Meta */}
        {/* avatar={ */}
        {/* <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}
        {/* } */}
        {/* title={<a href="https://ant.design">{item.user.fullName}</a>} */}
        {/* description={item.time} */}
        {/* /> */}
        {/* <div>Content</div> */}
        {/* </List.Item> */}
        {/* )} */}
        {/* /> */}
        <div
          ref={this.scrollTag}
          style={{
            maxHeight: '350px',
            overflow: 'auto',
            boxShadow: '0px 0px 10px 0px #888888',
          }}
        >
          {listCheckInV2.map(el => (
            <div>
              <List.Item key={el.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{el.user.email}</a>}
                  description={new Date(el.updatedAt).toLocaleString('en-US', {
                    timeZone: 'Asia/Jakarta',
                  })}
                />
                <Button style={{ marginRight: '5px' }} type="primary">
                  {el.status == 1 ? 'Đúng giờ' : 'Đi muộn'}
                </Button>
              </List.Item>
              <Divider style={{ margin: '0px', padding: '0px' }} />
            </div>
          ))}
        </div>
      </ResultWarapper>
    );
  }
}

Result.propTypes = {
  listCheckIn: PropTypes.array.isRequired,
};
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  listCheckInV2: makeSelectListCheckIn(),
});
const withConnect = connect(mapStateToProps);
export default withRouter(compose(withConnect)(Result));
