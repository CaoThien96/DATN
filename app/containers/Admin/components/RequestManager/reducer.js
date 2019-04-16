import { fromJS } from 'immutable';
import { UPDATE_REQUEST_DETAIL } from './constans';

export const initialState = fromJS({
  requestDetail: false,
});
function RequestReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_REQUEST_DETAIL:
      return state.set('requestDetail', action.payload);
    default:
      return state;
  }
}

export default RequestReducer;
