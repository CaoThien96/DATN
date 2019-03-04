/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_USER_LOGIN,
  LOAD_USER_LOGIN_SUCCESS,
  LOAD_USER_LOGIN_FAIL,
  SHOW_LOADING,
  HIDDEN_LOADING,
  REMOVE_USER,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  showLoading: false,
  error: false,
  currentUser: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADING:
      return state.set('showLoading', true);
    case HIDDEN_LOADING:
      return state.set('showLoading', false);
    case LOAD_USER_LOGIN:
      return state.set('loading', true).set('error', false);
    case LOAD_USER_LOGIN_SUCCESS:
      return state.set('loading', false).set('currentUser', action.user);
    case LOAD_USER_LOGIN_FAIL:
      return state.set('error', action.error).set('loading', false);
    case REMOVE_USER:
      return state.set('currentUser', false);
    default:
      return state;
  }
}

export default appReducer;
