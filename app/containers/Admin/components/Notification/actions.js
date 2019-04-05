import { ADD_COMMENT, ADD_NOTIFICATION_DETAIL } from './constans';

export function addComment(payload) {
  return {
    type: ADD_COMMENT,
    payload,
  };
}
export function addNotification(payload) {
  return {
    type: ADD_NOTIFICATION_DETAIL,
    payload,
  };
}
