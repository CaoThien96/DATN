import { Can } from '@casl/react';
import PropTypes from 'prop-types';
import { AbilityBuilder } from '@casl/ability';
import React from 'react';
const CanWrapper = ({ user, children, I, a }) => {
  const ability = AbilityBuilder.define((can, cannot) => {
    if (user.role === 1001) {
      can(['read', 'create', 'comment'], 'Notification');
    } else if (user.role === 1000) {
      can(['read', 'comment'], 'Notification');
    }
  });
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
