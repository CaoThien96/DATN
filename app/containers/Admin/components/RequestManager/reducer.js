import { fromJS } from 'immutable';
import {
  UPDATE_REQUEST_DETAIL,
  FETCH_REQUEST_DETAIL,
  FETCH_REQUEST_DETAIL_SUCCESS,
  FETCH_REQUEST_DETAIL_FAIL,
} from './constans';

export const initialState = fromJS({
  requestDetail: false,
  loading: false,
  err: false,
});
function RequestReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_REQUEST_DETAIL:
      return state.set('requestDetail', action.payload);
    case FETCH_REQUEST_DETAIL:
      return state.set('loading', true);
    case FETCH_REQUEST_DETAIL_SUCCESS:
      return state.set('requestDetail', action.payload).set('loading', false);
    case FETCH_REQUEST_DETAIL_FAIL:
      return state.set('loading', false).set('err', action.payload);
    default:
      return state;
  }
}

export default RequestReducer;
