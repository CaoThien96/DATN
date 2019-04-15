import { fromJS } from 'immutable';
import {
  ON_PREDICT_RESULT,
  ON_PREDICT_UNKNOWN,
  ON_UPDATE_LIST_CHECKIN,
  ON_PREDICT,
  ON_UPDATE_MODEL
} from './constans';
export const initialState = fromJS({
  object: false,
  pending: false,
  listCheckIn: [],
  predict: [],
  statusPredict: true,
});
function checkerReducer(state = initialState, action) {
  switch (action.type) {
    case ON_PREDICT_RESULT:
      return state
        .set('predict', [...state.predict, action.payload])
        .set('statusPredict', true);
    case ON_PREDICT:
      return state.set('pending', true);
    case ON_PREDICT_UNKNOWN:
      return state.set('pending', false);
    case ON_UPDATE_LIST_CHECKIN:
      return state.set('listCheckIn', action.payload).set('pending', false);
    default:
      return state;
  }
}

export default checkerReducer;
