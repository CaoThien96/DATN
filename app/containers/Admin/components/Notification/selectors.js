/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const notificationState = state => state.get('notification');

const makeSelectNotificationDetail = () =>
  createSelector(notificationState, globalState =>
    globalState.get('notificationDetail'),
  );

export { makeSelectNotificationDetail };
