/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { makeSelectCurrentUser } from 'containers/App/selectors'
import { updateNewsSuccess, updateNewsFail } from './actions';
import { UPDATE_NEWS } from './constanst';

export function* getNews() {
  // Select username from store
  const user = yield select(makeSelectCurrentUser());
  const requestURL = `/api/news/newsByUser/${user.iid}`;
  const token = localStorage.getItem('token');
  try {
    // Call our request helper (see 'utils/request')
    const news = yield call(request, requestURL, {
      method: 'GET',
      headers: new Headers({
        authorization: token,
      }),
    });
    yield put(updateNewsSuccess(news.payload));
  } catch (err) {
    yield put(updateNewsFail(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* updateNews() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(UPDATE_NEWS, getNews);
}
