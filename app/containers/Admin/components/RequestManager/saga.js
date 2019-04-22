import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { FETCH_REQUEST_DETAIL } from './constans';
import { fetchRequestDetaiFail, fetchRequestDetaiSuccess } from './actions';
import { updateNews } from '../../actions';
import { makeSelectCurrentUser } from '../../../App/selectors';
export function* getRequest(arg) {
  const { id } = arg.payload;
  const requestURL = `/api/request/${id}`;
  const token = localStorage.getItem('token');
  try {
    // Call our request helper (see 'utils/request')
    const requestDetail = yield call(request, requestURL, {
      method: 'GET',
      headers: new Headers({
        authorization: token,
      }),
    });
    console.log({ requestDetail });
    yield put(fetchRequestDetaiSuccess(requestDetail.payload));
    yield put(updateNews());
  } catch (err) {
    yield put(fetchRequestDetaiFail(err));
  }
}
export default function* watchFetchRequest() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(FETCH_REQUEST_DETAIL, getRequest);
}
