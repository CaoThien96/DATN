import { createSelector } from 'reselect';
const selectAdmin = state => state.get('admin');
export const makeSelectNews = () =>
  createSelector(selectAdmin, globalState => globalState.get('news'));
