import firebase from 'firebase/app';
export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      messagingSenderId: '558545437663',
    });
    console.log('khoi tao app thanh cong');
  }else {
    console.log('App da ton tai');
  }

};
export const Test = ()=>{
  console.log('hello')
  console.log(firebase.apps)
  const length = firebase.apps.length;
  if(!length){
    firebase.initializeApp({
      messagingSenderId: '558545437663',
    });
    console.log('chua ton tai')
  }else{
    console.log('da ton tai')
  }
}
export const askForPermissioToReceiveNotifications = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = firebase.messaging();
      await messaging.requestPermission();
      const token = await messaging.getToken();
      console.log('token do usuário:', token);
      return resolve(token);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
