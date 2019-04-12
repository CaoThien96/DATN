import { createSelector } from 'reselect';

const notificationState = state => state.get('checker');

const makeSelectPredict = () =>
  createSelector(notificationState, globalState => globalState.get('predict'));
const makeSelectObject = () =>
  createSelector(notificationState, globalState => globalState.get('object'));
const makeSelectListCheckIn = () =>
  createSelector(notificationState, globalState =>
    globalState.get('listCheckIn'),
  );
const makeSelectPending = () =>
  createSelector(notificationState, globalState => globalState.get('pending'));

export {
  makeSelectPredict,
  makeSelectObject,
  makeSelectListCheckIn,
  makeSelectPending,
};
