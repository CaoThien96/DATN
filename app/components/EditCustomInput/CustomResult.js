import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
const CustomResult = props => {
  const { value, type } = props;
  console.log(moment.unix(value).hour())
  console.log(type)
  if(value){
    switch (type) {
      case 'text':
        return <span>{value}</span>;
      case 'time':
        return (
          <span>{`${moment.unix(value).hour()}:${moment
            .unix(value)
            .minute()}`}</span>
        );
      default:
        return <span>{value}</span>;
    }
  }else{
   return <span>{'empty'}</span>
  }

};
CustomResult.propTypes = {
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
};
export default CustomResult;
