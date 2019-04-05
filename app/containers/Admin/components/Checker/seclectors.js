import { createSelector } from 'reselect';

const notificationState = state => state.get('checker');

const makeSelectPredict = () =>
  createSelector(notificationState, globalState => globalState.get('predict'));
const makeSelectObject = () =>
  createSelector(notificationState, globalState => globalState.get('object'));

export { makeSelectPredict, makeSelectObject };
