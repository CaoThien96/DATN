const path = require('path');
module.exports.model = path.resolve(
  __dirname,
  path.resolve(__dirname, '../../public/model/model.json'),
);
module.exports.pathModel = path.resolve(
  __dirname,
  path.resolve(__dirname, '../../public/model'),
);
module.exports.pathAvatar = name =>
  path.resolve(
    __dirname,
    path.resolve(__dirname, `../../public/avatar/${name}`),
  );
module.exports.pathNotification = name =>
  path.resolve(
    __dirname,
    path.resolve(__dirname, `../../public/notification/${name}`),
  );
module.exports.pathRequest = name =>
  path.resolve(
    __dirname,
    path.resolve(__dirname, `../../public/request/${name}`),
  );
module.exports.pathTrain = name =>
  path.resolve(
    __dirname,
    path.resolve(__dirname, `../../public/train/${name}`),
  );
