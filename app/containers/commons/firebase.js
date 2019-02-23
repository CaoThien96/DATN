import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBkTJhMicDHmRpgILvLU4ddgltntVqkd-Y',
  authDomain: 'datn-39295.firebaseapp.com',
  databaseURL: 'https://datn-39295.firebaseio.com',
  projectId: 'datn-39295',
  storageBucket: 'datn-39295.appspot.com',
  messagingSenderId: '558545437663',
};
firebase.initializeApp(config);

export default firebase;
// vì test thử database nên ta export database trong firebase
export const database = firebase.database();
