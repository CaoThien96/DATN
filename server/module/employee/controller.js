const fs = require('fs');
const commonPath = require('../../common/path');
const User = require('./model');
module.exports.handleCreateManualUser = (req, res) => {
  let data = fs.readFileSync(commonPath.pathDataJson());
  data = JSON.parse(data);
  const users = data.map(el => {
    const label = el.label;
    const des = el.descriptors;
    return new Promise((resolve, reject) => {
      const newUser = new User();
      newUser.role = 1000;
      newUser.email = `${label}@gmail.com`;
      newUser.password = '123456';
      newUser.training = JSON.stringify({
        _label: label,
        _descriptors: des,
      });
      newUser.save((err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  });
  Promise.all(users).then(data=>{
    res.send(data)
  })
};
module.exports.handleSaveImageTrain = (req, res, next) => {
  try {
    const dataUrls = JSON.parse(req.body.dataUrls);
    const userIid = req.params.iid;
    const pathFolder = commonPath.pathTrain(userIid);

    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(commonPath.pathTrain(userIid));
    }
    const taskSaveImage = dataUrls.map(
      (el, key) =>
        new Promise((resolve, reject) => {
          const data = el.replace(/^data:image\/\w+;base64,/, '');
          const buf = new Buffer(data, 'base64');
          const pathSave = commonPath.pathTrain(`${userIid}/${key}.png`);
          fs.writeFile(pathSave, buf, (err, mes) => {
            if (err) {
              return reject(err);
            }
            return resolve(mes);
          });
        }),
    );
    Promise.all(taskSaveImage)
      .then(oke => {
        res.send({
          success: true,
          payload: 'luu thanh cong',
        });
      })
      .catch(err => {
        res.send({ success: false, err });
      });
  } catch (e) {
    res.send({ success: false, err: e });
  }
};
