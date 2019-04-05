import { fromJS } from 'immutable';
import { ON_PREDICT_RESULT, ON_PREDICT_UNKNOWN } from './constans';
export const initialState = fromJS({
  object: false,
  predict: [],
  statusPredict: true,
});
function checkerReducer(state = initialState, action) {
  switch (action.type) {
    case ON_PREDICT_RESULT:
      return state
        .set('predict', [...state.predict, action.payload])
        .set('statusPredict', true);
    case ON_PREDICT_UNKNOWN:
      return state.set('statusPredict', 'unknown');
    default:
      return state;
  }
}

export default checkerReducer;
