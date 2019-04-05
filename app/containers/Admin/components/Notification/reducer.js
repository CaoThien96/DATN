import { fromJS } from 'immutable';
import { ADD_COMMENT, ADD_NOTIFICATION_DETAIL,ON_ADD_COMMENT } from './constans';
export const initialState = fromJS({
  notificationDetail: null,
});
function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION_DETAIL:
      return state.set('notificationDetail', action.payload);
    case ON_ADD_COMMENT:
      console.log({action})
      return state.set('notificationDetail', action.payload);
    default:
      return state;
  }
}

export default notificationReducer;
