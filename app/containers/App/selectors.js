/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRouter = state => state.get('router');
/**
 * Lay thong tin nguoi dung da dang nhap
 * @returns {OutputSelector<any, any, (res: any) => any> | OutputParametricSelector<any, any, any, (res: any) => any> | OutputSelector<any, any, (res1: any, res2: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any, res11: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any, res11: any) => any> | OutputSelector<any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any, res11: any, res12: any) => any> | OutputParametricSelector<any, any, any, (res1: any, res2: any, res3: any, res4: any, res5: any, res6: any, res7: any, res8: any, res9: any, res10: any, res11: any, res12: any) => any> | OutputSelector<any, any, (...res: any[]) => any> | OutputParametricSelector<any, any, any, (...res: any[]) => any>}
 */
const makeSelectCurrentUser = () =>
  createSelector(selectGlobal, globalState => globalState.get('currentUser'));
const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('loading'));
const makeSelectShowLoading = () =>
  createSelector(selectGlobal, globalState => globalState.get('showLoading'));
const makeSelectError = () =>
  createSelector(selectGlobal, globalState => globalState.get('error'));
const makeSelectModel = () =>
  createSelector(selectGlobal, globalState => globalState.get('model'));
const makeSelectUsersOfModel = () =>
  createSelector(selectGlobal, globalState => globalState.get('usersOfModel'));
const makeSelectShouldUpdateModel = () =>
  createSelector(selectGlobal, globalState =>
    globalState.get('shouldUpdateModel'),
  );
export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectShowLoading,
  makeSelectLoading,
  makeSelectError,
  makeSelectModel,
  makeSelectShouldUpdateModel,
  makeSelectUsersOfModel
};
