import {
  ADD_COMMENT,
  UPDATE_REQUEST_DETAIL,
  ADD_REPLY,
  FETCH_REQUEST_DETAIL,
  FETCH_REQUEST_DETAIL_FAIL,
  FETCH_REQUEST_DETAIL_SUCCESS,
} from './constans';

export function addComment(payload) {
  return {
    type: ADD_COMMENT,
    payload,
  };
}

export function addReply(payload) {
  return {
    type: AD_REPPLY,
    payload,
  };
}
export function updateRequestDetail(payload) {
  return {
    type: UPDATE_REQUEST_DETAIL,
    payload,
  };
}

export function fetchRequestDetail(payload) {
  return {
    type: FETCH_REQUEST_DETAIL,
    payload
  };
}
export function fetchRequestDetaiSuccess(payload) {
  return {
    type: FETCH_REQUEST_DETAIL_SUCCESS,
    payload,
  };
}
export function fetchRequestDetaiFail(err) {
  return {
    type: FETCH_REQUEST_DETAIL_FAIL,
    payload: err,
  };
}
