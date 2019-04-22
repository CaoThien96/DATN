importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '558545437663',
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/Content/Img/logo-amezze-120.png',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
// messaging.onMessage(function(payload) {
//   console.log('Message received. ', payload);
//   // ...
// });

