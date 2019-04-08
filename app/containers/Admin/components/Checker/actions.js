import { ON_PREDICT, ON_PREDICT_RESULT,ON_UPDATE_LIST_CHECKIN} from './constans';

export function onPredict(payload) {
  return {
    type: ON_PREDICT,
    payload,
  };
}
export function onPredictResult(payload) {
  return {
    type: ON_PREDICT_RESULT,
    payload,
  };
}
export function onUpdateListCheckIn(payload) {
  return {
    type: ON_UPDATE_LIST_CHECKIN,
    payload,
  };
}
