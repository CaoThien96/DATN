import { fromJS } from 'immutable';
import {
  ON_UPDATE_LIST_CHECKIN,
} from './constans';
export const initialState = fromJS({
  listCheckIn: [],
});
function checkerReducer(state = initialState, action) {
  switch (action.type) {
    case ON_UPDATE_LIST_CHECKIN:
      return state.set('listCheckIn', action.payload);
    default:
      return state;
  }
}

export default checkerReducer;
