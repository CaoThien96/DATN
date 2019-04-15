import {
  ON_PREDICT,
  ON_PREDICT_RESULT,
  ON_UPDATE_LIST_CHECKIN,
  ON_UPDATE_MODEL,
} from './constans';

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
export function onUpdateModel(model) {
  return {
    type: ON_UPDATE_MODEL,
    payload: model,
  };
}
