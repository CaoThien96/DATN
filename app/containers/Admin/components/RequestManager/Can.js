import { Can } from '@casl/react';
import PropTypes from 'prop-types';
import { AbilityBuilder } from '@casl/ability';
import React from 'react';
const CanWrapper = ({ user, children, I, a }) => {
  const ability = AbilityBuilder.define((can, cannot) => {
    if (user.role === 1001) {
      console.log('Toi la admin');
      can(['read', 'handle', 'comment'], 'Request');
    } else if (user.role === 1000) {
      console.log('Toi la nhan vien');
      can(['read', 'create', 'comment'], 'Request');
    }
  });
  console.log(ability.can('handle', 'Request'));
  return (
    <Can I={I} a={a} ability={ability}>
      {children}
    </Can>
  );
};
CanWrapper.propTypes = {
  user: PropTypes.object.isRequired,
  I: PropTypes.string.isRequired,
  a: PropTypes.string.isRequired,
};
export default CanWrapper;
