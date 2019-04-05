import { ON_PREDICT, ON_PREDICT_RESULT} from './constans';

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
