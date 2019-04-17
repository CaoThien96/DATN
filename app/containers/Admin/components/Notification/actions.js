import { ADD_COMMENT, UPDATE_NOTIFICATION_DETAIL } from './constans';

export function addComment(payload) {
  return {
    type: ADD_COMMENT,
    payload,
  };
}
export function updateNotificationDetail(payload) {
  return {
    type: UPDATE_NOTIFICATION_DETAIL,
    payload,
  };
}
