import {
  UPDATE_NEWS,
  UPDATE_NEWS_SUCCESS,
  UPDATE_NEWS_FAIL,
} from './constanst';
export const updateNews = () => ({
  type: UPDATE_NEWS,
});
export const updateNewsSuccess = payload => ({
  type: UPDATE_NEWS_SUCCESS,
  payload,
});
export const updateNewsFail = err => ({
  type: UPDATE_NEWS_FAIL,
  payload: err,
});
