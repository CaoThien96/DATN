const mongoose = require('mongoose');
const config = require('./index');

const {
  db: { host, port, name },
} = config;
let connectionString = `mongodb://${host}:${port}/${name}`;
if (process.env.NODE_ENV === 'production') {
  connectionString = 'mongodb://admin:admin123@ds129153.mlab.com:29153/meeting';
}
// console.log(connectionString);
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Succession connected database');

  })
  .catch(() => {
    console.log('Errors connected database');
    process.exit()
  });
