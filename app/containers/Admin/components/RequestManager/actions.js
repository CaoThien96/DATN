import { ADD_COMMENT, UPDATE_REQUEST_DETAIL,ADD_REPLY } from './constans';

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
