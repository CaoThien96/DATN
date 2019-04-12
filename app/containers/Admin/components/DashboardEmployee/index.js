import React, { Component } from 'react';
import Calendar from './components/Calendar';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from '../../../App/selectors';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class Index extends Component {
  render() {
    const  {currentUser} = this.props;
    return (
      <div>
        <Calendar currentUser={currentUser}/>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(
  mapStateToProps,
);
export default withRouter(compose(withConnect)(Index));
