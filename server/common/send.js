const admin = require('firebase-admin');

const serviceAccount = require('../configs/datn-39295-firebase-adminsdk-nwmh3-1fc8ad5e61');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://datn-39295.firebaseio.com',
});
