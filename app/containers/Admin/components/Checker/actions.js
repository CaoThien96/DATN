import {
  ON_PREDICT,
  ON_UPDATE_LIST_CHECKIN,
} from './constans';

export function onPredict(payload) {
  return {
    type: ON_PREDICT,
    payload,
  };
}

export function onUpdateListCheckIn(payload) {
  return {
    type: ON_UPDATE_LIST_CHECKIN,
    payload,
  };
}

