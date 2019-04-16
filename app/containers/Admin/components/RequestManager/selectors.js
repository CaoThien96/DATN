/**
 * The request state selectors
 */

import { createSelector } from 'reselect';

const requestState = state => state.get('request');

export const makeSelectRequestDetail = () =>
  createSelector(requestState, globalState => globalState.get('requestDetail'));
