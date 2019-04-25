const fs = require('fs')
const commonPath = require('../../common/path')
module.exports.handleSaveImageTrain = (req,res,next)=>{
  try {
    const dataUrls = JSON.parse(req.body.dataUrls);
    const userIid = req.params.iid;
    const pathFolder = commonPath.pathTrain(userIid);

    if(!fs.existsSync(pathFolder)){
      fs.mkdirSync(commonPath.pathTrain(userIid));
    }
    const taskSaveImage = dataUrls.map((el,key)=>{
      return new Promise((resolve, reject) => {
        var data = el.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        const pathSave = commonPath.pathTrain(`${userIid}/${key}.png`)
        fs.writeFile(pathSave, buf,(err,mes)=>{
          if(err){
            return reject(err)
          }
          return resolve(mes)
        });
      })
    })
    Promise.all(taskSaveImage).then(oke=>{
      res.send({
        success:true,
        payload:'luu thanh cong'
      })
    }).catch(err=>{
      res.send({success:false,err})
    })
  }catch (e) {
    res.send({success:false,err:e})
  }

}
