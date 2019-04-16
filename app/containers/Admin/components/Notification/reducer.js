import { fromJS } from 'immutable';
import { UPDATE_NOTIFICATION_DETAIL } from './constans';
export const initialState = fromJS({
  notificationDetail: false,
});
function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATION_DETAIL:
      return state.set('notificationDetail', action.payload);
    default:
      return state;
  }
}

export default notificationReducer;
