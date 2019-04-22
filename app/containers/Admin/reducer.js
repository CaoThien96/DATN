import { fromJS } from 'immutable';
import {
  UPDATE_NEWS,
  UPDATE_NEWS_SUCCESS,
  UPDATE_NEWS_FAIL,
} from './constanst';

const initialState = fromJS({
  news: [],
  loading: false,
  err: false,
});
function appReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NEWS:
      return state.set('loading', true);
    case UPDATE_NEWS_SUCCESS:
      return state.set('news', action.payload).set('loading', false);
    case UPDATE_NEWS_FAIL:
      return state.set('loading', false).set('err', action.payload);
    default:
      return state;
  }
}
export default appReducer;
