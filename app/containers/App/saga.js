/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_USER_LOGIN } from 'containers/App/constants';
import { loadUserSuccess, loadUserFail } from 'containers/App/actions';

import request from 'utils/request';
/**
 * Github repos request/response handler
 */
function fetchUserByToken(token) {
  return fetch({
    method: 'POST',
    url: 'http://localhost:3000/get-current-user',
    headers: new Headers({
      authorization: token,
    }),
  })
    .then(res => res.json())
    .catch(err => err);
}
export function* getCurrentUser() {
  // Select username from store
  const requestURL = `/api/get-current-user`;
  const token = localStorage.getItem('token');
  try {
    // Call our request helper (see 'utils/request')
    const user = yield call(request, requestURL, {
      method: 'GET',
      headers: new Headers({
        authorization: token,
      }),
    });
    yield put(loadUserSuccess(user));
  } catch (err) {
    yield put(loadUserFail(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* currentUserData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_USER_LOGIN, getCurrentUser);
}
