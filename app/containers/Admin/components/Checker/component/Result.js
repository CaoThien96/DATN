import React, { Component } from 'react';
import PropTypes from 'prop-types';

const CheckIn = ({ infor }) => <div>!@345547567</div>;

const Result = props => {
  const { listCheckIn } = props;
  return (
    listCheckIn &&
    listCheckIn.map((el, key) => <CheckIn infor={el} key={key} />)
  );
};

Result.propTypes = {
  listCheckIn: PropTypes.array.isRequired,
};

export default Result;
