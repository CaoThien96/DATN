/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_USER_LOGIN,
  LOAD_USER_LOGIN_SUCCESS,
  LOAD_USER_LOGIN_FAIL,
  SHOW_LOADING,
  HIDDEN_LOADING,
  REMOVE_USER
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadUserLogin() {
  return {
    type: LOAD_USER_LOGIN,
  };
}
export function loadUserSuccess(user) {
  return {
    type: LOAD_USER_LOGIN_SUCCESS,
    user,
  };
}
export function loadUserFail(error) {
  return {
    type: LOAD_USER_LOGIN_FAIL,
    error,
  };
}
export function removeUser(error) {
  return {
    type: REMOVE_USER,
  };
}
/**
 *
 * @returns {{type: *}}
 */
export function showLoading() {
  return {
    type: SHOW_LOADING,
  };
}

/**
 *
 * @returns {{type: *}}
 */
export function hiddenLoading() {
  return {
    type: HIDDEN_LOADING,
  };
}
